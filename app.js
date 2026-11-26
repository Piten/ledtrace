import { accumulate, squareCrop } from './image.js';

const byId = (id) => document.getElementById(id);
const video = byId('video');
const result = byId('result');
const size = result.width;
const camera = byId('camera');
const capture = byId('capture');
const reset = byId('reset');
const exportButton = byId('export');
const trace = byId('trace');
const preview = byId('preview');
const threshold = byId('threshold');
const glow = byId('glow');
const status = byId('status');

function makeCanvas(side, options) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = side;
  return canvas.getContext('2d', options);
}

const input = makeCanvas(size, { willReadFrequently: true });
const base = makeCanvas(size);
const bloom = makeCanvas(80);
const output = result.getContext('2d', { alpha: false });
const pixels = base.createImageData(size, size);
for (let i = 3; i < pixels.data.length; i += 4) pixels.data[i] = 255;

let stream;
let opening = false;
let generation = 0;
let recording = false;
let view = 'trace';
let hasFrames = false;
let animation = 0;
let lastSample = -Infinity;
let lastVideoTime = -1;

function refreshControls() {
  const ready = Boolean(stream) && !opening;
  camera.textContent = opening ? 'Avbryt kameraåpning' : ready ? 'Lukk kamera' : 'Åpne kamera';
  preview.disabled = !ready;
  capture.disabled = !ready;
  capture.textContent = recording ? 'Stopp sporing' : 'Start sporing';
  reset.disabled = exportButton.disabled = !hasFrames;
  trace.setAttribute('aria-pressed', String(view === 'trace'));
  preview.setAttribute('aria-pressed', String(view === 'preview'));
  video.hidden = !stream;
  result.hidden = view !== 'trace';
  byId('empty').hidden = Boolean(ready || hasFrames);
}

function show(nextView) {
  view = nextView;
  refreshControls();
}

function render() {
  base.putImageData(pixels, 0, 0);
  output.drawImage(base.canvas, 0, 0);
  if (Number(glow.value) === 0) return;

  // Downsample and smoothly enlarge the image to spread the highlights.
  bloom.drawImage(base.canvas, 0, 0, bloom.canvas.width, bloom.canvas.height);
  output.save();
  output.globalCompositeOperation = 'lighter';
  output.globalAlpha = Number(glow.value) / 100;
  output.drawImage(bloom.canvas, 0, 0, size, size);
  output.restore();
}

function stopRecording() {
  recording = false;
  cancelAnimationFrame(animation);
}

function closeCamera(message = 'Kamera av') {
  generation++;
  opening = false;
  stopRecording();
  stream?.getTracks().forEach((track) => track.stop());
  stream = undefined;
  video.srcObject = null;
  status.textContent = message;
  show('trace');
}

function cameraError(error) {
  switch (error.name) {
    case 'NotAllowedError':
    case 'SecurityError':
      return 'Kameratilgang avvist. Tillat kamera i nettstedsinnstillingene og prøv igjen.';
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'Fant ikke et tilgjengelig bakovervendt kamera.';
    case 'NotReadableError':
    case 'AbortError':
      return 'Kameraet kunne ikke åpnes. Lukk andre apper som bruker kameraet og prøv igjen.';
    default:
      return 'Kameraet kunne ikke startes. Åpne siden på nytt i Safari eller Chrome.';
  }
}

async function openCamera() {
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
    status.textContent = 'Åpne HTTPS-lenken direkte i Safari eller Chrome for å bruke kameraet.';
    return;
  }

  const request = ++generation;
  opening = true;
  status.textContent = 'Venter på kamera. Gi tilgang hvis nettleseren spør.';
  refreshControls();

  try {
    const nextStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { exact: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
    });
    if (request !== generation || document.hidden) {
      nextStream.getTracks().forEach((track) => track.stop());
      if (request === generation) closeCamera();
      return;
    }

    stream = nextStream;
    for (const track of stream.getVideoTracks()) {
      track.addEventListener('ended', () => {
        if (stream === nextStream) closeCamera('Kameraet ble frakoblet.');
      }, { once: true });
    }

    // Make the inline video visible while Safari starts playback.
    video.hidden = false;
    result.hidden = true;
    byId('empty').hidden = true;
    video.srcObject = stream;
    await video.play();
    if (request !== generation) return;
    opening = false;
    status.textContent = 'Kamera klart. Sikt inn motivet.';
    show('preview');
  } catch (error) {
    if (request === generation) closeCamera(cameraError(error));
  }
}

function sample(now) {
  if (!recording) return;
  if (now - lastSample >= 1000 / 15 && video.readyState >= 2 &&
      video.videoWidth && video.videoHeight && video.currentTime !== lastVideoTime) {
    lastSample = now;
    lastVideoTime = video.currentTime;
    input.drawImage(video, ...squareCrop(video.videoWidth, video.videoHeight), 0, 0, size, size);
    accumulate(pixels.data, input.getImageData(0, 0, size, size).data, Number(threshold.value));
    render();
    if (!hasFrames) {
      hasFrames = true;
      refreshControls();
    }
  }
  animation = requestAnimationFrame(sample);
}

camera.addEventListener('click', () => {
  if (opening || stream) closeCamera();
  else openCamera();
});
capture.addEventListener('click', () => {
  if (recording) {
    stopRecording();
    status.textContent = 'Sporing stoppet. Kameraet er på.';
  } else {
    recording = true;
    lastSample = -Infinity;
    lastVideoTime = -1;
    status.textContent = 'Sporing pågår.';
    animation = requestAnimationFrame(sample);
  }
  show('trace');
});
trace.addEventListener('click', () => show('trace'));
preview.addEventListener('click', () => show('preview'));
reset.addEventListener('click', () => {
  stopRecording();
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = 0;
  }
  hasFrames = false;
  render();
  status.textContent = stream ? 'Lyssporet er nullstilt. Kameraet er på.' : 'Lyssporet er nullstilt.';
  show(stream ? 'preview' : 'trace');
});
threshold.addEventListener('input', () => { byId('thresholdValue').value = threshold.value; });
glow.addEventListener('input', () => {
  byId('glowValue').value = glow.value + ' %';
  render();
});
exportButton.addEventListener('click', () => {
  // Encode synchronously so the download starts in the user gesture.
  const link = document.createElement('a');
  link.href = result.toDataURL('image/png');
  link.download = 'complicated-time-peace-' + new Date().toISOString().replace(/[:.]/g, '-') + '.png';
  document.body.append(link);
  link.click();
  link.remove();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && (stream || opening)) closeCamera('Kamera av. Åpne kameraet for å fortsette.');
});
window.addEventListener('pagehide', () => closeCamera());

render();
refreshControls();

export const IMAGE_SIZE = 224;

export const startWebcam = async videoElement => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    });
    videoElement.srcObject = stream;
    return new Promise(resolve => {
      videoElement.onloadedmetadata = () => {
        videoElement.play();
        resolve();
      };
    });
  } catch (error) {
    console.error('Error starting webcam:', error);
  }
};

export const drawFaceBox = (video, canvas, predictions) => {
  if (!canvas || !video || !predictions || predictions.length === 0) {
    console.log('No faces detected or invalid inputs');
    return;
  }

  console.log('Drawing faces:', predictions.length);
  console.log('Face box details:', predictions[0].box); // Debug info

  // Set canvas dimensions to match video
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Try without mirroring first
  predictions.forEach(prediction => {
    const box = prediction.box;
    // Draw box with clear visibility
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgb(255, 0, 0)';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.15)';

    // Draw directly without transformation first
    ctx.beginPath();
    ctx.rect(box.xMin, box.yMin, box.width, box.height);
    ctx.stroke();
    ctx.fill();

    // Add the confidence score
    if (prediction.score) {
      const score = Math.round(prediction.score * 100);
      ctx.fillStyle = 'rgb(255, 0, 0)';
      ctx.font = '16px Arial';
      ctx.fillText(`${score}%`, box.xMin, box.yMin - 5);
    }

    // Draw facial landmarks if available
    if (prediction.keypoints) {
      prediction.keypoints.forEach(keypoint => {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'yellow';
        ctx.fill();
      });
    }
  });
};

export const clearCanvas = canvas => {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

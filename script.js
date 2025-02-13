// Extract URL parameters for phone and name
const urlParams = new URLSearchParams(window.location.search);
const phoneNumber = urlParams.get("phone") || "919832172970";
const headingName = urlParams.get("name") || "Nidhi";

// Update the heading
document.addEventListener("DOMContentLoaded", () => {
	const headerEl = document.getElementById("header");
	if (headerEl) {
		headerEl.textContent = headingName;
	}
});

// Text animation
setTimeout(() => {
	document.getElementById("question").textContent =
		"Will you be my Valentine?";
	document.getElementById("question").style.opacity = "1";

	setTimeout(() => {
		document.getElementById("camera-container").style.display = "block";
		setTimeout(() => {
			document.getElementById("camera-container").style.opacity = "1";
			initializeCamera();
		}, 100);
	}, 1500);
}, 1000);

// Camera setup
async function initializeCamera() {
	try {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false,
		});
		const videoElement = document.getElementById("video");
		videoElement.srcObject = stream;
		await videoElement.play();
	} catch (err) {
		alert("Please allow camera access to continue");
		console.error(err);
	}
}

// Capture and share photo
function captureAndShare() {
	const video = document.getElementById("video");
	const canvas = document.createElement("canvas");
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;

	// Draw video frame to canvas
	const context = canvas.getContext("2d");
	context.drawImage(video, 0, 0, canvas.width, canvas.height);

	// Convert canvas to blob
	canvas.toBlob(
		(blob) => {
			// Create a FormData object to send the image
			const formData = new FormData();
			formData.append("image", blob, "valentine-response.jpg");

			// Create temporary URL for the image
			const imageUrl = URL.createObjectURL(blob);
			const message = "Here's my Valentine's response! ❤️";

			// Use Web Share API if available
			if (
				navigator.canShare &&
				navigator.canShare({
					files: [
						new File([blob], "valentine-response.jpg", {
							type: "image/jpeg",
						}),
					],
					title: "Valentine Response",
					text: message,
				})
			) {
				navigator
					.share({
						files: [
							new File([blob], "valentine-response.jpg", {
								type: "image/jpeg",
							}),
						],
						title: "Valentine Response",
						text: message,
					})
					.catch((err) => {
						// Fallback to direct WhatsApp sharing
						shareToWhatsApp(imageUrl, message);
					});
			} else {
				// Direct WhatsApp sharing
				shareToWhatsApp(imageUrl, message);
			}
		},
		"image/jpeg",
		0.8
	);
}

function shareToWhatsApp(imageUrl, message) {
	// Construct WhatsApp URL with both message and image
	const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
		message + " " + imageUrl
	)}`;
	window.open(whatsappUrl, "_blank");
}

// Create floating hearts animation
function createHeart() {
	const heart = document.createElement("div");
	heart.classList.add("heart");
	heart.style.left = Math.random() * 100 + "vw";
	heart.style.animationDuration = Math.random() * 2 + 3 + "s";
	heart.style.width = heart.style.height = Math.random() * 20 + 10 + "px";
	document.body.appendChild(heart);

	setTimeout(() => {
		heart.remove();
	}, 5000);
}

setInterval(createHeart, 300);

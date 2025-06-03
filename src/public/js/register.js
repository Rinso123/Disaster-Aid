
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM is ready");
  const locationInput = document.getElementById("location");
  console.log(locationInput);
  if (!locationInput) return;

  // If browser doesn’t support geolocation, show an error
  if (!navigator.geolocation) {
    console.error("Geolocation API not supported by this browser.");
    locationInput.value = "Unavailable";
    return;
  }

  // Options: highAccuracy off, 10-second timeout, no caching
  const geoOptions = {
    enableHighAccuracy: false,
    timeout: 10000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(6);
      const lon = position.coords.longitude.toFixed(6);
      locationInput.value = `${lat},${lon}`;
    },
    (err) => {
      // Handle errors (permission denied, timeout, etc.)
      switch (err.code) {
        case err.PERMISSION_DENIED:
          console.error("User denied geolocation request.");
          locationInput.value = "Permission denied";
          break;
        case err.POSITION_UNAVAILABLE:
          console.error("Position unavailable.");
          locationInput.value = "Unavailable";
          break;
        case err.TIMEOUT:
          console.error("Geolocation request timed out.");
          locationInput.value = "Timeout";
          break;
        default:
          console.error("Geolocation error:", err.message);
          locationInput.value = "Error";
      }
    },
    geoOptions
  );
});

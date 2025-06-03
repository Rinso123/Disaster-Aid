const setLocation = () => {
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
      window._custom = {
        geolocation: {
          lat: lat,
          lon: lon
        }
      }
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
}

const getImageCard = (helpType) => {
  let path = "";
  switch (helpType) {
    case "food": path = "/images/diet.png"; break;
    case "medicine": path = "/images/medicine.png"; break;
    case "shelter": path = "/images/shelter.png"; break;
  }
  return `<img src="${path}" alt="${helpType}" class="card-img-top">`;
}
const setOffers = async () => {

  const offers = document.getElementById("offers");

  const { lat, lon } = window._custom.geolocation;
  const query = `?lat=${lat}&lng=${lon}`;
  const res = await fetch(`/api/offers/match${query}`);

  if (res.ok) {
    const data = await res.json();

    offers.innerHTML = "";
    data.forEach(offer => {

      const OFFER = `
<div class="card" style="width: 24rem;">
  ${getImageCard(offer.helpType)}
  <div class="card-body">
    <h5>
      ${offer.helpType}
    </h5>
    <p class="card-text">
      ${offer.description}
    </p>
    <button type="button" class="btn btn-primary" data-id=${offer._id}>Accept</button>
  </div>
</div>
`;

      offers.innerHTML += OFFER;
    });
  } else {
    console.error("Failed to fetch offers");
  }
}
const setRequests = async () => {
  const requests = document.getElementById("requests");

  const { lat, lon } = window._custom.geolocation;
  const query = `?lat=${lat}&lng=${lon}`;
  const res = await fetch(`/api/requests/match${query}`);

  if (res.ok) {
    const data = await res.json();

    requests.innerHTML = "";
    data.forEach(offer => {

      const REQUEST = `
<div class="card" style="width: 24rem;">
  ${getImageCard(offer.helpType)}
  <div class="card-body">
    <h5>
      ${offer.helpType}
    </h5>
    <p class="card-text">
      ${offer.description}
    </p>
    <button type="button" class="btn btn-primary" data-id=${offer._id}>Accept</button>
  </div>
</div>
`;

      requests.innerHTML += REQUEST;
    });
  } else {
    console.error("Failed to fetch requests");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  setLocation();
  setInterval(setLocation, 60 * 1000);

  setTimeout(setRequests, 2000);
  setTimeout(setOffers, 2000);

  document.getElementById("offers").addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    const res = await fetch(`/api/offers/${id}/accept`, {
      method: "POST"
    });
    if (res.ok) {
      setOffers();
    }
  });

  document.getElementById("requests").addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    const res = await fetch(`/api/requests/${id}/accept`, {
      method: "POST",
    });
    if (res.ok) {
      setRequests();
    }
  });


  const socket = io("/", {
    withCredentials: true
  });

  socket.on("connect", () => {
    console.log("Connected to server, socket id:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
  });

  socket.on("connect", () => {
    console.log("Connected to server, socket id:", socket.id);
  });

  socket.on("newRequest", (_) => {
    setRequests();
  });

  socket.on("newOffer", (_) => {
    setOffers();
  });

})

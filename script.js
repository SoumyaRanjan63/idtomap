const ipAddressElem = document.getElementById("ipAddress");
const getInfoBtn = document.getElementById("getInfoBtn");
const mapContainer = document.getElementById("map");
const timeElem = document.getElementById("time");
const searchBox = document.getElementById("searchBox");
const postalOfficesList = document.getElementById("postalOffices");

// Get user's IP address
function getUserIPAddress() {
    fetch("https://api64.ipify.org?format=json")
        .then(response => response.json())
        .then(data => {
            const userIP = data.ip; // Get the user's IP address
            ipAddressElem.textContent = userIP;
            getInfoBtn.addEventListener("click", () => {
                fetchLocationInfo(userIP); // Pass the user's IP to the next function
            });
        })
        .catch(error => console.error("Error fetching IP address:", error));
}

// Fetch location info using IP address
function fetchLocationInfo(ip) {
    fetch(`https://ipinfo.io/${ip}/json`)  // Use /json instead of /geo
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error fetching location info: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.loc) {
                throw new Error("Location data not available");
            }

            const [latitude, longitude] = data.loc.split(",");
            showMap(parseFloat(latitude), parseFloat(longitude));
            getTime(data.timezone);
            fetchPostalOffices(data.postal.code);  // Use postal.code instead of postal
        })
        .catch(error => console.error(error));
}

// Show Google Map
function showMap(latitude, longitude) {
    const map = new google.maps.Map(mapContainer, {
        center: { lat: latitude, lng: longitude },
        zoom: 12,
    });

    new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
    });
}
// Get current time for given timezone
function getTime(timezone) {
    fetch(`https://worldtimeapi.org/api/timezone/${timezone}`)
        .then(response => response.json())
        .then(data => {
            const currentTime = new Date(data.utc_datetime);
            const formattedTime = currentTime.toLocaleString();
            timeElem.textContent = `Current Time: ${formattedTime}`;
        })
        .catch(error => console.error("Error fetching time:", error));
}

// Fetch postal offices based on pincode
function fetchPostalOffices(pincode) {
    fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then(response => response.json())
        .then(data => {
            const offices = data[0].PostOffice;
            renderPostalOffices(offices);
        })
        .catch(error => console.error("Error fetching postal offices:", error));
}

// Render postal offices list
function renderPostalOffices(offices) {
    postalOfficesList.innerHTML = "";
    const searchText = searchBox.value.toLowerCase();
    offices.forEach(office => {
        if (
            office.Name.toLowerCase().includes(searchText) ||
            office.BranchType.toLowerCase().includes(searchText)
        ) {
            const listItem = document.createElement("li");
            listItem.textContent = `${office.Name} (${office.BranchType})`;
            postalOfficesList.appendChild(listItem);
        }
    });
}

// Initial setup
getUserIPAddress();
getInfoBtn.addEventListener("click", () => {
    fetchLocationInfo(ipAddressElem.textContent);
});

// Google Maps API callback
function initMap() {
    // This function needs to exist, but it doesn't need to do anything here.
}
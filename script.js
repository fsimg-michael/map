document.addEventListener("DOMContentLoaded", () => {
 const span = document.querySelector("span")
 const messageDiv = document.getElementById("message")

 // Map's geographic boundaries
 const topLat = 35.674215     // top (north)
 const leftLon = 139.709322   // left (west)
 const bottomLat = 35.672706  // bottom (south)
 const rightLon = 139.711079  // right (east)

 // Image dimensions (as specified in the HTML)
 const img = document.querySelector("img")
 const imgWidth = img.width
 const imgHeight = img.height

 // Store the current dot position (starting at 0,0)
 let currentX = 0
 let currentY = 0

 // Helper function to display messages
 function showMessage(msg) {
  messageDiv.textContent = msg
 }

 // Animate the dot from (startX, startY) to (targetX, targetY) over the given duration
 function animateDot(startX, startY, targetX, targetY, duration = 1000) {
  let startTime = null
  function step(timestamp) {
   if (!startTime) startTime = timestamp
   const progress = timestamp - startTime
   const t = Math.min(progress / duration, 1)
   const currentPosX = startX + (targetX - startX) * t
   const currentPosY = startY + (targetY - startY) * t
   span.style.transform = `translate(${currentPosX}px, ${currentPosY}px)`
   if (t < 1) {
    requestAnimationFrame(step)
   } else {
    // Update the current position after the animation completes
    currentX = targetX
    currentY = targetY
   }
  }
  requestAnimationFrame(step)
 }

 // Function to update location and animate the dot accordingly
 function updateLocation() {
  if (!("geolocation" in navigator)) {
   showMessage("Geolocation is not supported by your browser.")
   return
  }
  navigator.geolocation.getCurrentPosition(
   (position) => {
    const userLat = position.coords.latitude
    const userLon = position.coords.longitude

    // Check if the user's location is within the map boundaries
    if (
     userLat > topLat ||
     userLat < bottomLat ||
     userLon < leftLon ||
     userLon > rightLon
    ) {
     showMessage("マップの外にいらっしゃいます")
     return
    }
    showMessage("") // Clear any previous message

    // Calculate the proportional position on the image:
    // For x (longitude)
    const targetX = ((userLon - leftLon) / (rightLon - leftLon)) * imgWidth
    // For y (latitude) - note: latitude decreases as you go down
    const targetY = ((topLat - userLat) / (topLat - bottomLat)) * imgHeight

    // Animate from the current dot position to the new target position
    animateDot(currentX, currentY, targetX, targetY, 1000)
   },
   (error) => {
    showMessage("Error obtaining location: " + error.message)
   }
  )
 }

 // Immediately update the location on load
 updateLocation()
 // Then update location every 5 seconds (5000 milliseconds)
 setInterval(updateLocation, 5000)
})
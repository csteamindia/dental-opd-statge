export const getTimezoneFromIP = async() =>  {
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        console.log("Timezone:", data.timezone); 
        return data.timezone; // e.g., "Asia/Kolkata"
    } catch (err) {
        console.error("Error fetching timezone:", err);
        return null;
    }
}

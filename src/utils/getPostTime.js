function formatDate(dateString) {
    let date = new Date(dateString); // Directly parse the standard format date string

    let day = date.getDate().toString().padStart(2, "0");
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear();
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");

    // Get timezone offset in hours and minutes
    let offset = -date.getTimezoneOffset();
    let offsetHours = Math.floor(Math.abs(offset) / 60)
        .toString()
        .padStart(2, "0");
    let offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, "0");
    let offsetSign = offset >= 0 ? "+" : "-";

    let timezoneOffset = `TZ GMT${offsetSign}${offsetHours}:${offsetMinutes}`;
    let dateFormatted = `${day}/${month}/${year} ${hours}:${minutes} (${timezoneOffset})`;

    return dateFormatted;
}

function getPostId(linkedinURL) {
    let regex = new RegExp("([0-9]{19})");
    let match = regex.exec(linkedinURL);
    if (match) {
        return match[1];
    }
    return "";
}

function extractUnixTimestamp(postId) {
    // BigInt is used as postId is treated as a 64-bit decimal
    let asBinary = BigInt(postId).toString(2);
    let first41Chars = asBinary.substring(0, 41);
    let timestamp = parseInt(first41Chars, 2);
    return timestamp;
}

function unixTimestampToHumanDate(timestamp) {
    // get the utc date from the timestamp
    let dateObject = new Date(timestamp);
    return dateObject.toUTCString();
}

export function getDate(url) {
    // extract the unix timestamp from the post's url
    let postId = getPostId(url);
    if (!postId) return "";
    let unixTimestamp = extractUnixTimestamp(postId);
    // convert the unix timestamp to a human-readable date string
    let humanDateFormat = unixTimestampToHumanDate(unixTimestamp);

    let formattedDate = formatDate(humanDateFormat);

    return formattedDate;
}

export function formatDate(date) {
    if (!(date instanceof Date)) {
        throw new Error("Invalid date object");
    }
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
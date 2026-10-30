// https://www.thingiverse.com/developers/rest-api-reference

/*******************************************************************************
 * The headers needed for authenticating with the API.
 * Get the SECRET_TOKEN using the browser tools of Firefox or Chrome:
 * 1. Open the browser tools with F12 or ctrl+shift+i
 * 2. Navigate to the Network tab
 * 3. Reload a Thingiverse page
 * 4. Locate a and select a request to api.thingiverse.com
 * 5. Find the request headers and copy the token next to Authorization: Bearer
 * 6. Replace SECRET_TOKEN below with that token.
 ********************************************************************************/
const username_jorge = "jorgeluisrivera01"

var headers = {
    "Authorization": "Bearer REDACTED_THINGIVERSE_TOKEN",
    // 'Host': 'api.thingiverse.com',
    // 'Content-Type': 'application/json'

}
/**************************
 * List user collections
 *************************/
export async function getCollections() {
    const response = await fetch(
        "https://api.thingiverse.com/users/" + username_jorge + "/collections/",
        {
            "credentials": "same-origin",
            "headers": headers,
            "method": "GET",
            "mode": "cors"
        }
    )
    return response.json()
}
// Example listing user collections
// getCollections(username_jorge)
//     .then(collections => {
//         collections.forEach(collection => {
//             console.log(collection.name + ': ' + collection.id)
//         });
//     })
/*******************************
 * Add a thing to a collection
 ******************************/
export async function addThingToCollection() {
    const response = await fetch(
        " https://api.thingiverse.com/collections/32147964/thing/5199378/",
        {
            "credentials": "same-origin",
            "headers": headers,
            "method": "POST",
            "mode": "cors",
        });
    return response.json()
}

// Example adding thing to collection
// var deskCollectionID = 8800327
// addThingToCollection(deskCollectionID, 607518)

/*******************************
 * Update a collection
 ******************************/
// const collection_ID = "19970570"
export async function udateCollection() {
    // export async function udateCollection(collectionID) {
    const response = await fetch(
        "https://api.thingiverse.com/collections/32364463/",
        // "https://api.thingiverse.com/collections/" + collection_ID,
        {
            "credentials": "same-origin",
            "headers": headers,
            "method": "PATCH",
            "mode": "cors",
            "body": JSON.stringify({ name: "hola" })

        });
    return response.json()
}
/*******************************
 * Create a collection
 ******************************/
export async function createCollection() {
    // export async function udateCollection(collectionID) {
    const response = await fetch(
        "https://api.thingiverse.com/collections/jorgeluisrivera01" + username_jorge,
        // "https://api.thingiverse.com/collections/" + collection_ID,
        {
            "credentials": "same-origin",
            "headers": headers,
            "method": "POST",
            "mode": "cors",
            "body": JSON.stringify({ name: "hola" })

        });
    return response.json()
}
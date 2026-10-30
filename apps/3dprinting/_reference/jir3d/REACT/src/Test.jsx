import { useState } from "react"

const TestApp = function () {
    const [entries, setEntries] = useState([])
    const addEntry = (entry) => {
        setEntries([...entries, entry].sort((a, b) => a.lastName.toLowerCase() > b.lastName.toLowerCase() ? 1 : -1))
    }
    const myArray = [4, 4, 6, 3, 3, 1, 1, 1]

    let store = {}
    let storeArray = []
    myArray.forEach(number => {
        if (store[number]) {
            store[number] = store[number] + 1
        } else {
            store[number] = 1
        }
    });
    myArray.forEach(number => {
        if (!storeArray.includes(number)) {
            storeArray = [...storeArray, number]
        }
    });
    console.log(storeArray.sort(() => 0))
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column" }}>
        <EntryForm addEntry={addEntry} />
        <DisplayEntries entries={entries} />
    </div>
}

const EntryForm = ({ addEntry }) => {
    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [number, setNumber] = useState("")
    return <>
        <form onSubmit={(e) => {
            e.preventDefault()
            addEntry({ name, lastName, number })
        }}>
            <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <input placeholder="LastName" onChange={(e) => setLastName(e.target.value)} />
            <input placeholder="Phone" onChange={(e) => setNumber(e.target.value)} />
            <button type="submit"></button>
        </form>
    </>
}

const DisplayEntries = function ({ entries }) {
    return <table>
        <thead>
            <tr>
                <th>Last Name</th>
                <th> Name</th>
                <th> Number</th>
            </tr>
        </thead>
        <tbody>
            {
                entries.map(entry =>
                    <tr key={entry.number}>
                        <td>{entry.lastName}</td>
                        <td>{entry.name}</td>
                        <td>{entry.number}</td>
                    </tr>
                )

            }
        </tbody>
    </table>
}
export default TestApp
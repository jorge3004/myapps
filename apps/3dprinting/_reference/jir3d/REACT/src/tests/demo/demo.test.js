describe("Pruebas DEMO", () => {
    test("Primera prueba ", () => {
        // const m1 = "hola"
        // const m2 = "hola"
        // expect(m1).toBe(m2)
    })
    // test("Get saludo debe retornar Hola Jorge ", () => {
    //     const name = "Jorge"
    //     const saludo = getSaludo(name)
    //     expect(saludo).toBe("Hola" + name)
    // })
    // test("toStrictEqual ", () => {
    //     const a = { name: "Jorge", n: 0 }
    //     const b = { name: "Jorge", n: "" }
    //     expect(a).toEqual(b)
    //     expect(a).toStrictEqual(b)
    // })
    // test("Prube destru arr ", () => {
    //     const a = ["abc", 123]
    //     const [letters, numbers] = a
    //     // expect(letters).toBe("abc")
    //     expect(letters).toEqual(expect.any(String))
    // })
    // test("imp expt", () => {

    // })
    // test("Pruebas en promesas retorno de nombre", (done) => {
    //     const id = 1
    //     getByIdAsync(id).then(res => {
    //         expect(res).toEqual({ id: 1, name: "jorge1" })
    //         done()
    //     })
    // })
    // test("Pruebas en promesas retorno error", (done) => {
    //     const id = 5
    //     getByIdAsync(id).then(item => {
    //         expect(item).toBeFalsy()
    //         done()
    //     }).catch(e => {
    //         expect(e).toBe("No se pudo")
    //         done()
    //     })
    // })
    // test("Pruebas async-await", async () => {
    //     const data = await fetchJIR()
    //     expect(typeof data).toBe("object")
    // })
    // test("Pruebas async-await catch", async () => {
    //     const data = await fetchJIR()
    //     expect(data).toBe("No se encontro")
    // })
})

const getByIdAsync = (id) => new Promise((resolve, reject) => {
    // setTimeout(() => {
    const found = getbyId(id);
    if (found) {
        resolve(found)
    } else {
        reject("No se pudo")
    }
    // }, 300);
})

const fetchJIR = async () => {
    try {
        const resp = await fetch("https://api.jir3d.com/usuariosz.php")
        // const resp = await fetch("http://localhost:8081/usuarios")
        const data = await resp.json()
        return data
    } catch (e) {
        // console.log(e);
        return 'No se encontro'
    }
}

const getbyId = (id) => {
    const array = [{ id: 1, name: "jorge1" }, { id: 2, name: "jorge2" }]
    return array.find(item => item.id === id)
}



const getSaludo = (name) => {
    return "Hola" + name
}

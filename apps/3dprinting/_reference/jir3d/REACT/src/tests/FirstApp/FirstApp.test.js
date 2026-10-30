import { render } from "@testing-library/react"
import { FirstApp } from "./FirstApp"


describe("Pruebas componentes", () => {
    // test("Debe de hacer match con el snapshot", () => {
    //     const { container } = render(<FirstApp />)
    //     expect(container).toMatchSnapshot()
    // })
    // test("Debe mostrar titulo en un h1", () => {
    //     const title = "Hola"
    //     const { container, getByText, getByTestId } = render(<FirstApp title={"Hola "} />)
    //     // expect(getByText(titulo)).toBeTruthy()
    //     // const h1 = container.querySelector("h1")
    //     // expect(h1.innerHTML).toContain(titulo)
    //     // expect(h1.innerHTML).toBe(titulo)
    //     // expect(getByTestId('test-title')).toBeTruthy()
    //     // expect(getByTestId('test-title').innerHTML).toBe(title)
    //     expect(getByTestId('test-title').innerHTML).toContain(title)
    // })
    test("Debe mostrar el subtitulo enviado por props", () => {
        const title = "title1"
        const subTitle = "sub1"
        const { getAllByText } = render(
            <FirstApp
                title={title}
                subTitle={subTitle}
            />
        )
        // expect(getByText(subTitle)).toBeTruthy()
        expect(getAllByText(subTitle).length).toBe(2)

    })
})
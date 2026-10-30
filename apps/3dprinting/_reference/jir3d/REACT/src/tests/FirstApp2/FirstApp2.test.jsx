import { render, screen } from "@testing-library/react"
import { FirstApp2 } from "./FirstApp2"


describe("Pruebas componentes FirstApp2", () => {
    const title = "Hola desde titulo2"
    const subTitle = "Hola desde subTitle"
    test("Deber hacer match con snapshot", () => {
        const { container } = render(<FirstApp2 title={title} />)
        expect(container).toMatchSnapshot()
    })
    test("Debe mostrar el mensaje", () => {
        render(<FirstApp2 title={title} />)
        expect(screen.getByText(title)).toBeTruthy()
    })
    test("Debe de mostrar el titulo en un h1", () => {
        render(<FirstApp2 title={title} />)
        expect(screen.getByRole("heading", { level: 1 }).innerHTML).toBe(title)
    })
    test("Debe de mostrar el subtitulo mandado por props", () => {
        render(<FirstApp2 title={title} subTitle={subTitle} />)
        expect(screen.getAllByText(subTitle).length).toBe(2)
    })
})
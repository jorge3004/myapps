import { CounterApp } from "./CounterApp"
import { render, screen, fireEvent } from "@testing-library/react"

describe("Pruebas en <CounterApp/>", () => {
    const init = 10
    test("debe de hacer el match con el snapshot", () => {
        const { container } = render(<CounterApp init={init} />)
        expect(container).toMatchSnapshot()
    })
    test("debe de mostrar valor inicial de 10", () => {
        render(<CounterApp init={init} />)
        expect(screen.getByText(10)).toBeTruthy()
        expect(screen.getByRole("heading", { level: 2 }).innerHTML).toBe("CounterApp")
    })
    test("debe de incrementar con boton +1", () => {
        render(<CounterApp init={init} />)
        fireEvent.click(screen.getByText("+1"))
        expect(screen.getByText("11")).toBeTruthy()
    })
    test("debe de decrementar con boton -1", () => {
        render(<CounterApp init={init} />)
        fireEvent.click(screen.getByText("-1"))
        // screen.debug()
        expect(screen.getByText("9")).toBeTruthy()
    })
    test("debe de reiniciar con boton reset", () => {
        render(<CounterApp init={init} />)
        fireEvent.click(screen.getByText("+1"))
        fireEvent.click(screen.getByText("+1"))
        fireEvent.click(screen.getByText("+1"))
        fireEvent.click(screen.getByRole("button", { name: "btn-reset" }))
        // screen.debug()
        expect(screen.getByText("10")).toBeTruthy()
    })
})
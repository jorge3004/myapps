export const userColor = (user = {}) => {
    return {
        text: `${user.darkMode === undefined
            ? "text-light"
            : user.darkMode ? "text-light" : "text-dark"
            }`,
        textInv: `${user.darkMode === undefined
            ? "text-dark"
            : user.darkMode ? "text-dark" : "text-light"
            }`,
        table: `${user.darkMode === undefined
            ? "table-dark"
            : user.darkMode ? "table-dark" : "table-light"
            } `,
        bg: `${user.darkMode === undefined
            ? "bg-dark"
            : user.darkMode ? "bg-dark" : "bg-secondary"
            } `,
        applyBg: () => {
            if (user.darkMode === undefined || user.darkMode)
                document.body.style = "background: #36393F"
            else
                document.body.style = "background: #C0C0C0"
            // document.body.style = "background: #B2BEB5"
            // document.body.style = "background: #808080"
            // document.body.style = "background: #FFFFFF"
        }

        // `${user.darkMode === undefined
        // ? true
        // : user.darkMode === "true" ? true : false}`,
    }

}
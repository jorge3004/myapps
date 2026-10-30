import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

// pages/_document.js



// import React from "react";
// import Document, { Html, Head, Main, NextScript, DocumentContext } from "next/document";
// import { CssBaseline } from "@nextui-org/react";

// class MyDocument extends Document {
//   static async getInitialProps(ctx: DocumentContext) {
//     const initialProps = await Document.getInitialProps(ctx);
//     return {
//       ...initialProps,
//       styles: React.Children.toArray([initialProps.styles]),
//     };
//   }

//   render() {
//     return (
//       <Html lang="en">
//         <Head>{CssBaseline.flush()}</Head>
//         <body>
//           <Main />
//           <NextScript />
//         </body>
//       </Html>
//     );
//   }
// }

// export default MyDocument;

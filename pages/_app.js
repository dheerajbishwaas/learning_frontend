import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
  <>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <Component {...pageProps} /></>)
}

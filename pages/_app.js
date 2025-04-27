import '../styles/globals.css';
import Layout from '../components/Layout'; // Import the Layout

export default function App({ Component, pageProps }) {
  return (
  <>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
  <Layout>
  <Component {...pageProps} /> </Layout></>)
}

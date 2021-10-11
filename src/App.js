import { useEffect, useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import Books from "./Books";

import "./styles.css";

const endpoint = (isbn) => `https://openlibrary.org/isbn/${isbn}.json`;

function useArray(initialValue = []) {
  const [items, setItems] = useState(initialValue);

  const add = (item) => {
    setItems((current) => [...current, item]);
  };

  return {
    add,
    items
  };
}

export default function App() {
  const { items, add } = useArray();
  const [isbn, setIsbn] = useState();
  const [scanning, setScanning] = useState(false);

  const fetchBookInfo = async (isbn) => {
    try {
      setScanning(true);
      const resp = await fetch(endpoint(isbn));
      const data = await resp.json();

      const title = data.title;
      const publishDate = data.publish_date;
      const author = data.authors[0].key;

      add({
        isbn,
        title,
        author,
        publishDate
      });
    } catch (error) {
      console.error(error);
    } finally {
      setScanning(false);
    }
  };

  const handleUpdate = (err, result) => {
    if (result) {
      setIsbn(result.text);
    }
  };

  const handleIsbnChange = (e) => {
    setIsbn(e.target.value);
  };

  useEffect(() => {
    if (isbn != null && isbn.length >= 9) {
      fetchBookInfo(isbn);
    }
  }, [isbn]);

  console.table(items);

  return (
    <div className="App">
      <BarcodeScannerComponent onUpdate={handleUpdate} />
      <p>{scanning && "Scanning Book..."}</p>
      <input value={isbn} onChange={handleIsbnChange} />

      <Books books={items} />
    </div>
  );
}

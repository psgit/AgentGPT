import {
  BlobProvider,
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import ReactPDF from "@react-pdf/renderer";
import { Message } from "./ChatWindow";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

// Create Messages PDF Document Component
const MessagesPDF = ({ messages }: { messages: Message[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        {messages.map((message) => (
          <Text>
            {message.type} - {message.value}
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);

const SaveMessagesToPDF = (mm: Message[]) => {
  alert("Save pdf");
  alert(JSON.stringify(mm));
  ReactPDF.render(<MessagesPDF messages={mm} />, `${__dirname}/example.pdf`);
  alert("finished pdf");
};

const GetPDF = (mm: Message[]) => {
  return (
    <BlobProvider document={<MessagesPDF messages={mm} />}>
      {({ blob, url, loading }) => {
        return loading ? "loading" : url;
      }}
    </BlobProvider>
  );
};

const DownloadPDF = (mm: Message[]) => {
  return (
    <PDFDownloadLink
      document={<MessagesPDF messages={mm} />}
      fileName="AgentGPT-Chat-Messages.pdf"
    >
      {({ blob, url, loading, error }) =>
        loading ? "Loading PDF document..." : "Download PDF"
      }
    </PDFDownloadLink>
  );
};

export default DownloadPDF;

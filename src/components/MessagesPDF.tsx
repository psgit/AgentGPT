import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
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
      {messages.map((message) => (
        <View style={styles.section}>
          <Text>
            {message.type} - {message.value}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);

export const saveMessagesToPDF = (mm: Message[]) => {
  ReactPDF.render(<MessagesPDF messages={mm} />, `${__dirname}/example.pdf`);
};

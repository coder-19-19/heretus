import ReactPdf, {Text, View} from "@react-pdf/renderer";
import RegularDejavu from '../Cashbox/DejaVuSans.ttf'
import BoldDejavu from '../Cashbox/DejaVuSans-Bold.ttf'
import ItalicDejavu from '../Cashbox/DejaVuSerif-Italic.ttf'
import Can from "../../components/Common/Can";

const PDFTemplate = ({data, disabled}) => {


    ReactPdf.Font.register({
        family: "DejaVu Sans",
        fonts: [
            {src: RegularDejavu, fontWeight: 'normal'},
            {src: BoldDejavu, fontWeight: 'bold'},
            {src: ItalicDejavu, fontStyle: 'italic'},
        ]
    });

    const styles = ReactPdf.StyleSheet.create({
        page: {
            flexDirection: 'column',
            backgroundColor: '#fff',
            fontFamily: 'DejaVu Sans',
            fontSize: 16,
            paddingLeft: 16,
            paddingRight: 16
        },
        header: {
            textAlign: 'center',
            fontWeight: 'bold'
        },
        bold: {
            fontWeight: 'bold'
        },
        section: {
            margin: 10,
            padding: 10,
        },
        textCenter: {
            textAlign: "center"
        },
        justifyBetween: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginLeft: 10,
            marginRight: 10,
            marginTop: 4,
            fontSize: 14,
        },
        divider: {
            height: 1,
            backgroundColor: '#000',
            width: '100%'
        },
        dividerText: {
            marginLeft: 8,
            marginRight: 8,
            fontSize: 10,
            fontStyle: 'italic'
        },
        footer: {
            marginTop: 16,
            marginBottom: 32,
            fontSize: 16,
        },
        table: {
            marginTop: 16,
            border: 1,
            borderColor: '#000',
        },
        tableHeaderRow: {
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: '#eff2ff',
        },
        tableHeaderCell: {
            textAlign: 'center',
            fontSize: 10,
            width: '24%',
            fontWeight: 'bold'
        },
        tableRow: {
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottom: '1px solid #000'
        },
        tableCell: {
            textAlign: 'center',
            fontSize: 10,
            width: '24%',
        }
    });


    return (
        <ReactPdf.BlobProvider document={<ReactPdf.Document>
            <ReactPdf.Page size="A4" style={styles.page}>
                <ReactPdf.View style={styles.section}>
                    <ReactPdf.Text style={styles.header}>
                        Invoice
                    </ReactPdf.Text>
                </ReactPdf.View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'column'}}>
                        <Text>{data?.company_id?.name}</Text>
                        <Text>{data?.company_id?.voen}</Text>
                        <Text>{data?.company_id?.address}</Text>
                        <Text>{data?.company_id?.phone}</Text>
                    </View>
                    <View style={{flexDirection: 'column'}}>
                        <Text>{data?.customer_id?.label}</Text>
                    </View>
                </View>
                <ReactPdf.View style={{flexDirection: 'column', marginTop: 16}}>
                    <ReactPdf.Text>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Xidmət:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.product_id?.label}
                        </ReactPdf.Text>
                    </ReactPdf.Text>
                    <ReactPdf.Text style={{marginTop: 2}}>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Say:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.quantity}
                        </ReactPdf.Text>
                    </ReactPdf.Text>
                    <ReactPdf.Text style={{marginTop: 2}}>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Qiymət:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.price}
                        </ReactPdf.Text>
                    </ReactPdf.Text>
                    <ReactPdf.Text style={{marginTop: 2}}>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Cəm:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.price * data?.quantity}
                        </ReactPdf.Text>
                    </ReactPdf.Text>
                </ReactPdf.View>
            </ReactPdf.Page>
        </ReactPdf.Document>}>
            {({url}) => {
                return <Can action="examinationPayment_pdf">
                    <a className={`btn btn-primary ${disabled && 'disabled'}`}
                       href={url}
                       target="_blank">
                        <i className="bx bx-printer"/>
                    </a>
                </Can>;
            }}
        </ReactPdf.BlobProvider>
    )
}

export default PDFTemplate

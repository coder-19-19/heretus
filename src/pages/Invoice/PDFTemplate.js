import ReactPdf, {Text, View} from "@react-pdf/renderer";
import RegularDejavu from '../Cashbox/DejaVuSans.ttf'
import BoldDejavu from '../Cashbox/DejaVuSans-Bold.ttf'
import ItalicDejavu from '../Cashbox/DejaVuSerif-Italic.ttf'
import Can from "../../components/Common/Can";
import moment from "moment";

const PDFTemplate = ({data, disabled, setPdf}) => {

    console.log(data)
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
            fontWeight: 'bold',
            fontSize: 24,
            color: '#7854f7'
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
                    <View style={{flexDirection: 'column', gap: 10}}>
                        <Text>
                            <ReactPdf.Text style={{fontWeight: 'bold', color: '#7854f7'}}>
                                {data?.company_id?.label}
                            </ReactPdf.Text>
                        </Text>
                        <Text>
                            <ReactPdf.Text style={{fontWeight: 'bold'}}>
                                VÖEN:{' '}
                            </ReactPdf.Text>
                            <ReactPdf.Text style={{fontStyle: 'italic'}}>
                                {data?.company_id?.voen}
                            </ReactPdf.Text>
                        </Text>
                        <Text>
                            <ReactPdf.Text style={{fontWeight: 'bold'}}>
                                Ünvan:{' '}
                            </ReactPdf.Text>
                            <ReactPdf.Text style={{fontStyle: 'italic'}}>
                                {data?.company_id?.address}
                            </ReactPdf.Text>
                        </Text>
                        <Text>
                            <ReactPdf.Text style={{fontWeight: 'bold'}}>
                                Nömrə:{' '}
                            </ReactPdf.Text>
                            <ReactPdf.Text style={{fontStyle: 'italic'}}>
                                {data?.company_id?.phone}
                            </ReactPdf.Text>
                        </Text>
                        <Text>
                            <ReactPdf.Text style={{fontWeight: 'bold'}}>
                                Email:{' '}
                            </ReactPdf.Text>
                            <ReactPdf.Text style={{fontStyle: 'italic'}}>
                                {data?.company_id?.email}
                            </ReactPdf.Text>
                        </Text>
                    </View>
                    <View style={{flexDirection: 'column', gap: 10}}>
                        <Text>
                            <Text style={{fontWeight: 'bold'}}>Tarix: {' '}</Text>
                            <Text>{moment(new Date()).format('DD.MM.YYYY HH:mm')}</Text>
                        </Text>
                        <Text>
                            <Text style={{fontWeight: 'bold'}}>Faktura No: {' '}</Text>
                            <Text>{data?.code}</Text>
                        </Text>
                    </View>
                </View>
                <View style={[styles.divider, {marginTop: 32}]}/>
                <View style={{flexDirection: 'column', gap: 10, marginTop: 32}}>
                    <Text>
                        <ReactPdf.Text style={{fontWeight: 'bold', fontSize: 20, color: '#7854f7'}}>
                            Müştəri
                        </ReactPdf.Text>
                    </Text>
                    <Text>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Sürücü:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.customer_id?.name}
                        </ReactPdf.Text>
                    </Text>
                    <Text>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Maşın nömrəsi:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.customer_id?.car_number}
                        </ReactPdf.Text>
                    </Text>
                    <Text>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Şirkət:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.customer_id?.company_name}
                        </ReactPdf.Text>
                    </Text>
                    <Text>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Maşın nömrəsi:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.customer_id?.car_number}
                        </ReactPdf.Text>
                    </Text>
                    <Text>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Şirkət nömrəsi:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.customer_id?.company_phone}
                        </ReactPdf.Text>
                    </Text>
                    <Text>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Sürücü nömrəsi:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.customer_id?.customer_phone}
                        </ReactPdf.Text>
                    </Text>
                    <Text>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Email:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.company_id?.email}
                        </ReactPdf.Text>
                    </Text>
                    <Text>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            VÖEN:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.company_id?.voen}
                        </ReactPdf.Text>
                    </Text>
                </View>
                <ReactPdf.View style={[styles.table, {marginTop: 32}]}>
                    <ReactPdf.View style={styles.tableHeaderRow}>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Xidmət/Məhsul</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Say</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Qiymət</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Cəm</ReactPdf.Text>
                    </ReactPdf.View>
                    <ReactPdf.View style={styles.tableRow}>
                        <ReactPdf.Text
                            style={[styles.tableCell]}>{data?.product_id?.label}</ReactPdf.Text>
                        <ReactPdf.Text
                            style={[styles.tableCell]}>{data?.quantity}</ReactPdf.Text>
                        <ReactPdf.Text
                            style={[styles.tableCell]}>{data?.price}</ReactPdf.Text>
                        <ReactPdf.Text
                            style={[styles.tableCell]}>{data?.price * data?.quantity}</ReactPdf.Text>
                    </ReactPdf.View>
                </ReactPdf.View>
            </ReactPdf.Page>
        </ReactPdf.Document>}>
            {({url, blob}) => {
                setPdf(blob)
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

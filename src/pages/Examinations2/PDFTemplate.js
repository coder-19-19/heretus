import ReactPdf from "@react-pdf/renderer";
import Logo from '../../assets/images/sidebar/logo.png'
import RegularDejavu from '../Cashbox/DejaVuSans.ttf'
import BoldDejavu from '../Cashbox/DejaVuSans-Bold.ttf'
import ItalicDejavu from '../Cashbox/DejaVuSerif-Italic.ttf'
import Can from "../../components/Common/Can";
import moment from "moment";

const PDFTemplate = ({item, examinations, selectedExaminations, totals}) => {
    let data = []
    if (examinations?.length) {
        data = [...examinations?.filter(e => selectedExaminations?.includes(e.id))]
    }
    if (item) {
        data = [item]
    }

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
                        <ReactPdf.Image style={{
                            width: 200,
                            height: 30,
                            marginLeft: 80
                        }} src={Logo}/>
                    </ReactPdf.Text>
                </ReactPdf.View>
                <ReactPdf.View style={styles.table}>
                    <ReactPdf.View style={styles.tableHeaderRow}>
                        <ReactPdf.Text style={[styles.tableHeaderCell, {width: '4%'}]}>№</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Müştəri</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Qəbul tarixi</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Ümumi ödəniş</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Ümumi borc</ReactPdf.Text>
                    </ReactPdf.View>
                    {data.map((patient, index) => (
                        <ReactPdf.View style={styles.tableRow} key={patient?.id}>
                            <ReactPdf.Text style={[styles.tableCell, {width: '4%'}]}>{index + 1}</ReactPdf.Text>
                            <ReactPdf.Text style={styles.tableCell}>{patient?.patient}</ReactPdf.Text>
                            <ReactPdf.Text
                                style={styles.tableCell}>{moment(item?.admission_date).format('DD.MM.YYYY')}</ReactPdf.Text>
                            <ReactPdf.Text style={styles.tableCell}>{patient?.totalPayment}</ReactPdf.Text>
                            <ReactPdf.Text style={styles.tableCell}>{patient?.totalDebt}</ReactPdf.Text>
                        </ReactPdf.View>
                    ))}
                </ReactPdf.View>
                {totals && (
                    <ReactPdf.View
                        style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, marginRight: 16}}>
                        <ReactPdf.Text>
                            Ümumi məbləğ :{' '}
                            <ReactPdf.Text>
                                {totals?.total_amount}{' '}AZN
                            </ReactPdf.Text>
                        </ReactPdf.Text>
                    </ReactPdf.View>
                )}
                {totals && (
                    <ReactPdf.View
                        style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, marginRight: 16}}>
                        <ReactPdf.Text>
                            Ümumi ödəniş:{' '}
                            <ReactPdf.Text style={{color: 'green'}}>
                                {totals?.total_payment}{' '}AZN
                            </ReactPdf.Text>
                        </ReactPdf.Text>
                    </ReactPdf.View>
                )}
                {totals && (
                    <ReactPdf.View
                        style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, marginRight: 16}}>
                        <ReactPdf.Text>
                            Ümumi borc:{' '}
                            <ReactPdf.Text style={{color: 'red'}}>
                                {totals?.total_debt}{' '}AZN
                            </ReactPdf.Text>
                        </ReactPdf.Text>
                    </ReactPdf.View>
                )}
            </ReactPdf.Page>
        </ReactPdf.Document>}>
            {({url}) => {
                return <Can action="examinationPayment_pdf">
                    <a className={`btn btn-primary ${!item && !selectedExaminations?.length && 'disabled'}`}
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

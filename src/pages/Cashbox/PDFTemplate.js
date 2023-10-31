import ReactPdf from "@react-pdf/renderer";
import RegularDejavu from './DejaVuSans.ttf'
import BoldDejavu from './DejaVuSans-Bold.ttf'
import ItalicDejavu from './DejaVuSerif-Italic.ttf'
import Can from "../../components/Common/Can";

const PDFTemplate = ({item, inputValues, examinations, selectedExaminations}) => {
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
                        {process.env.REACT_APP_COMPANY_NAME}
                    </ReactPdf.Text>
                </ReactPdf.View>
                <ReactPdf.View style={styles.footer}>
                    {/*<ReactPdf.Text style={styles.dividerText}>*/}
                    {/*    Bakı şəh, Bakıxanov qəs, S.Mehmandarov 8. {'\n'} Tel:+994 99 425 11 99 , +994 70 525 11 99,*/}
                    {/*    +994 12 425 64 94, +994 12 425 11 99.*/}
                    {/*</ReactPdf.Text>*/}
                    {/*<ReactPdf.View style={styles.divider}/>*/}
                    {/*<ReactPdf.Text style={styles.dividerText}>*/}
                    {/*    {moment(new Date()).format('DD.MM.YYYY HH:mm:ss')}*/}
                    {/*</ReactPdf.Text>*/}
                </ReactPdf.View>
                <ReactPdf.View style={{flexDirection: 'column'}}>
                    <ReactPdf.Text>
                        <ReactPdf.Text style={{fontWeight: 'bold'}}>
                            Müştəri adı:{' '}
                        </ReactPdf.Text>
                        <ReactPdf.Text style={{fontStyle: 'italic'}}>
                            {data?.[0]?.patient}
                        </ReactPdf.Text>
                    </ReactPdf.Text>
                    {data?.[0]?.phone && (
                        <ReactPdf.Text style={{marginTop: 2}}>
                            <ReactPdf.Text style={{fontWeight: 'bold'}}>
                                Tel:{' '}
                            </ReactPdf.Text>
                            <ReactPdf.Text style={{fontStyle: 'italic'}}>
                                {data?.[0]?.phone}
                            </ReactPdf.Text>
                        </ReactPdf.Text>
                    )}
                </ReactPdf.View>
                <ReactPdf.View style={styles.table}>
                    <ReactPdf.View style={styles.tableHeaderRow}>
                        <ReactPdf.Text style={[styles.tableHeaderCell, {width: '4%'}]}>№</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Nümayəndə</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Xidmət</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Qiymət</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Ödəniş</ReactPdf.Text>
                        <ReactPdf.Text style={styles.tableHeaderCell}>Borc</ReactPdf.Text>
                    </ReactPdf.View>
                    {data.map((patient, index) => (
                        <ReactPdf.View style={styles.tableRow} key={patient?.id}>
                            <ReactPdf.Text style={[styles.tableCell, {width: '4%'}]}>{index + 1}</ReactPdf.Text>
                            <ReactPdf.Text style={styles.tableCell}>{patient?.doctor}</ReactPdf.Text>
                            <ReactPdf.Text style={styles.tableCell}>{patient?.service}</ReactPdf.Text>
                            <ReactPdf.Text style={styles.tableCell}>{patient?.final_price}</ReactPdf.Text>
                            <ReactPdf.Text style={styles.tableCell}>{patient?.payment}</ReactPdf.Text>
                            <ReactPdf.Text style={styles.tableCell}>{patient?.debt}</ReactPdf.Text>
                        </ReactPdf.View>
                    ))}
                </ReactPdf.View>
                <ReactPdf.View
                    style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, marginRight: 16}}>
                    {data?.length && (
                        <ReactPdf.Text>
                            Cəm:{' '}
                            <ReactPdf.Text>
                                {data?.reduce((acc, val) => {
                                    return acc + val?.final_price
                                }, 0)}{' '}AZN
                            </ReactPdf.Text>
                        </ReactPdf.Text>
                    )}
                </ReactPdf.View>
                <ReactPdf.View
                    style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, marginRight: 16}}>
                    {data?.length && (
                        <ReactPdf.Text>
                            Cəm ödəniş:{' '}
                            <ReactPdf.Text style={{color: 'green'}}>
                                {data?.reduce((acc, val) => {
                                    return acc + val?.payment
                                }, 0)}{' '}AZN
                            </ReactPdf.Text>
                        </ReactPdf.Text>
                    )}
                </ReactPdf.View>
                <ReactPdf.View
                    style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16, marginRight: 16}}>
                    {data?.length && (
                        <ReactPdf.Text>
                            Cəm borc:{' '}
                            <ReactPdf.Text style={{color: 'red'}}>
                                {data?.reduce((acc, val) => {
                                    return acc + val?.debt
                                }, 0)}{' '}AZN
                            </ReactPdf.Text>
                        </ReactPdf.Text>
                    )}
                </ReactPdf.View>
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

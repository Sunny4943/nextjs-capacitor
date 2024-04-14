import styles from '../../styles/Home.module.css'
import { toast, Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React from "react";
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import Modal from 'react-awesome-modal';
import { GetMTM, InsertSymbol, OrderBook, TradeBook, UpdateStrategy, fetchDepthDetails, setGlobalStop, updateNotification, userLogin } from '../../src/AllFunction'
import { InputPicker, InputNumber, Table, Checkbox, IconButton, Toggle, DatePicker, Nav, Modal as Modal1 } from 'rsuite';
import CollaspedOutlineIcon from '@rsuite/icons/CollaspedOutline';
import ExpandOutlineIcon from '@rsuite/icons/ExpandOutline';
import "rsuite/dist/rsuite.min.css";
import { BsEyeFill } from "react-icons/bs";
import { FaEdit, FaSave } from "react-icons/fa";
import { MdCancel, MdAdd, MdMenu, MdOutlineClose, MdExitToApp } from "react-icons/md";
import Router from 'next/router';
if (typeof window !== 'undefined') {

    var testStore = localStorage.getItem("User") ? JSON.parse(localStorage.getItem("User")) : []
    // console.log(JSON.parse(localStorage.getItem("ReduxStore")))

}
const { Column, HeaderCell, Cell } = Table;
const rowKey = 'IndexN';
const CompactCell = (props) => <Cell {...props} style={{ padding: 10, fontWeight: 'bold', fontSize: 15 }} />;
const EditableCell = ({ rowData, rowIndex, name, state, dataKey, onTableCheckBoxChange, handleTableCellChange, ...props }) => (
    <Cell {...props} style={{ fontWeight: 'normal', margin: '0px', paddingRight: "3px", paddingBottom: "5px", marginTop: "0px", width: "150px" }} className={styles.cell1} >


        {((name === "StopBuy" || name === "StopTrade") ?
            <Checkbox className={((state[`${name}${rowIndex}`] === true) || (state[`${name}${rowIndex}`] === false)) ? (state[`${name}${rowIndex}`] === true ? "" : styles.rsuite_checkBox) : (parseInt(rowData[dataKey]) === 1 ? "" : styles.rsuite_checkBox)} name={`${name}${rowIndex}`} style={{ width: "auto", height: "auto", margin: '0px', padding: "0px", alignSelf: "center", paddingRight: "30px" }} checked={((state[`${name}${rowIndex}`] === true) || (state[`${name}${rowIndex}`] === false)) ? (state[`${name}${rowIndex}`] === true ? true : false) : (parseInt(rowData[dataKey]) === 1 ? true : false)} value={((state[`${name}${rowIndex}`] === true) || (state[`${name}${rowIndex}`] === false)) ? (state[`${name}${rowIndex}`] === true ? true : false) : (parseInt(rowData[dataKey]) === 1 ? true : false)} onChange={(value, checked, evt) => { onTableCheckBoxChange(`${name}${rowIndex}`, (checked)) }} />

            :
            ((name === "rowPrice") || (name === "Multiplier") ? <input name={`${name}${rowIndex}`} style={{ width: "100%", height: "auto", margin: '0px', textAlign: "right" }} value={(state[`${name}${rowIndex}`] || state[`${name}${rowIndex}`] === "") ? parseFloat(state[`${name}${rowIndex}`]).toFixed(2) : parseFloat(rowData[dataKey] / 100).toFixed(2)} onChange={(evt) => { handleTableCellChange(evt, `${name}${rowIndex}`) }}  ></input> :
                <input name={`${name}${rowIndex}`} style={{ width: "100%", height: "auto", margin: '0px', textAlign: "right" }} value={(state[`${name}${rowIndex}`] || state[`${name}${rowIndex}`] === "") ? state[`${name}${rowIndex}`] : rowData[dataKey]} onChange={(evt) => { handleTableCellChange(evt, `${name}${rowIndex}`) }}  ></input>))


        }
    </Cell >
)
const ExpandCell = ({ rowData, dataKey, expandedRowKeys, onChange, ...props }) => (
    <Cell {...props} style={{ padding: 1, marginBottom: "10px" }}>
        <IconButton
            appearance="subtle"
            onClick={() => {
                onChange(rowData);
            }}
            icon={
                expandedRowKeys.some(key => key === rowData[rowKey]) ? (
                    <CollaspedOutlineIcon />
                ) : (
                    <ExpandOutlineIcon />
                )
            }
        />
    </Cell>
);
const HeaderSummary = ({ top, bottom }) => (
    <div style={{
        wordWrap: "break-word",
        width: "auto",
        height: "auto",
        display: "flex", flexDirection: 'column', alignItems: "center"
    }}>

        <div
            style={{

            }}
        >
            {top}
        </div>
        <div
            style={{

            }}
        >
            {bottom}
        </div>
    </div>

);
const CheckboxWordWrap = ({ top, bottom, state, handleCheckAll }) => (
    <div style={{
        wordWrap: "break-word",
        width: "auto",
        height: "auto",
        display: "flex", flexDirection: 'column', alignItems: "center"
    }}>

        <div
            style={{

            }}
        >
            {top}
        </div>
        <div
            style={{

            }}
        >
            <Checkbox
                color="cyan"
                inline
                checked={state.StopAll}
                indeterminate={state.indeterminate}
                onChange={handleCheckAll}
                className={(state.StopAll || state.indeterminate) ? "" : styles.rsuite_checkBox}
            />
            {bottom}
        </div>
    </div>

);
//const userid = Router.query['client'];
export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "", Price: 0, Qty: 0, Userid: testStore.UserID ? testStore.UserID : "", UserCode: testStore.UserCode ? testStore.UserCode : "", UserName: testStore.Name ? testStore.Name : "", symbolList: [], strategyArray: [], AllStrategy: [],
            expandedRowKeys: [], selDepthDetails: {}, selDepthExchange: "", totalDepthBuyQty: 0, totalDepthSellQty: 0, selDepthDetails: {},
            selectedDepthSymbol: "", bid: [], ask: [], selDepthToken: "", StopAll: false, refreshToggle: false, checked: false,
            indeterminate: false, tabValue: 1, tabName: "Ladder", menuClose: true, activateKey: 1, openModal: false,
            fromDate: new Date(), toDate: new Date(), OrderBook: [], TradeBook: [], Multiplier: 0,
            OrderSymolArray: [], OrderStatusArray: [], TradeSymbolArray: [], selSymbol: "", selOrdStatus: "", netPnlDetails: []
        }
        this.fetchAllSymbol()
        //this.get_client()
        console.log(testStore)
    }
    handleCheckAll = async (value, checked) => {
        console.log(checked)
        let stop = 0;
        if (checked) {
            stop = 1
        }
        else {
            stop = 0
        }
        let updateResponse = await setGlobalStop(this.state.Userid, stop).then((res) => {
            return res ? res : []
        })
        if (updateResponse === 1) {
            this.setState({ StopAll: !(this.state.StopAll) })
        }
        // const keys = checked ? data.map(item => item.id) : [];
        //setCheckedKeys(keys);
    };
    CalcPnl = () => {
        let MTM = 0;
        MTM = this.state.netPnlDetails.length > 0 && this.state.netPnlDetails.reduce((a, b) => a + b?.RGain, 0)
        return MTM;
    }
    fetchOrderBook = async () => {
        if (this.state.fromDate && this.state.toDate) {
            if (this.state.fromDate > this.state.toDate) {
                toast.warn("From Date Not be Greater than To Date")
            }
            let tempOrderBook = await OrderBook(this.state.Userid).then((res) => {
                return res ? res : []
            })
            let query = "select distinct Symbol from CTCL_EQUITY.dbo.Orders where UserID=" + this.state.Userid + ""
            //let query = "select distinct SYMBOL,Token from CTCL_EQUITY.dbo.TEMPCONTRACT where INSTTYPE='FUTSTK' or INSTTYPE='FUTIDX'  order by symbol"
            console.log(query)
            const response = await fetch('/api/ctcl_equity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query, type: "select" }),
            }).then((result) => result.json()) // here
                .then((result) => {
                    if (result && result['data']) {
                        return result['data']
                    }
                })
            let SymbolList = []
            if (response) {
                for (let i = 0; i < response.length; i++) {
                    SymbolList.push({ label: response[i]["Symbol"], value: response[i]["Symbol"] })
                }
            }

            let query1 = "select distinct isnull(OrderStatus,'') as OrderStatus  from CTCL_EQUITY.dbo.Orders where UserID=" + this.state.Userid + " and isnull(OrderStatus,'')<>''"
            //let query = "select distinct SYMBOL,Token from CTCL_EQUITY.dbo.TEMPCONTRACT where INSTTYPE='FUTSTK' or INSTTYPE='FUTIDX'  order by symbol"
            console.log(query1)
            const response1 = await fetch('/api/ctcl_equity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: query1, type: "select" }),
            }).then((result) => result.json()) // here
                .then((result) => {
                    if (result && result['data']) {
                        return result['data']
                    }
                })
            let OrderList = []
            if (response1) {
                for (let i = 0; i < response1.length; i++) {
                    OrderList.push({ label: response1[i]["OrderStatus"], value: response1[i]["OrderStatus"] })
                }
            }


            this.setState({ OrderBook: tempOrderBook, OrderSymolArray: SymbolList, OrderStatusArray: OrderList })
        }
        else {
            toast.warn("Please Select Date")
        }
    }
    fetchTradeBook = async () => {
        if (this.state.fromDate && this.state.toDate) {
            if (this.state.fromDate > this.state.toDate) {
                toast.warn("From Date Not be Greater than To Date")
            }
            let tempTradeBook = await TradeBook(this.state.Userid).then((res) => {
                return res ? res : []
            })
            this.setState({ TradeBook: tempTradeBook })
        }
        else {
            toast.warn("Please Select Date")
        }
    }
    fetchAllSymbol = async () => {

        let query = "select distinct SYMBOL,Token from Ctcl_Strategy.dbo.TEMPCONTRACT_Zerodha where INSTTYPE='EQUITY' order by symbol"
        //let query = "select distinct SYMBOL,Token from CTCL_EQUITY.dbo.TEMPCONTRACT where INSTTYPE='FUTSTK' or INSTTYPE='FUTIDX'  order by symbol"
        console.log(query)
        const response = await fetch('/api/ctcl_equity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query, type: "select" }),
        }).then((result) => result.json()) // here
            .then((result) => {
                if (result && result['data']) {
                    return result['data']
                }
            })
        let tempSymbol = []
        let len = response.length
        for (let i = 0; i < len; i++) {
            tempSymbol.push({ label: response[i]['SYMBOL'], value: response[i]['Token'] })
        }
        // symbolList = tempSymbol;
        //this.get_client()
        this.setState({ symbolList: tempSymbol });
        // console.log(this.state.UserName)
        //let query1 = "select * from CTCL_EQUITY.dbo.MarketWatch where UserID=" + this.state.Userid + ""
        //let query1 = "select ClientCode as UserID,DBId as DBID,Symbol,Token,PriceGap,Quantity,StopBuy,StopTrd as StopTrade,LastBoughtPrice,LastSoldPrice,TotalPosition,LastBoughtQty,LastSoldQty,Notification,Inserted,UserName from CTCL_EQUITY.dbo.ScriptTrans where ClientCode=" + this.state.Userid + ""
        let query1 = "select (convert(varchar(3),mw.ClientCode)+'-'+convert(varchar(3),mw.DBid)) as IndexN, mw.ClientCode as UserID,mw.Multiplier,isnull(mwl.QtyFilled,0) as QtyFilled,mw.DBId  as DBID,mw.Token,mw.Symbol,mw.PriceGap,mw.Quantity,mw.StopBuy,mw.StopTrd as StopTrade,mw.LastBoughtPrice,mw.LastSoldPrice,mw.TotalPosition,mw.LastBoughtQty,mw.LastSoldQty,isnull(mw.LastBoughtTime,'') as LastBoughtTime,isnull(mw.LastSoldTime,'') as LastSoldTime,isnull(mwl.BsFlag,0) as BsFlag,isnull(mwl.Price,0) as Price,isnull(mwl.qty,0) as qty,isnull(mwl.InsertTime,'') as InsertTime,isnull(mwl.Executed,0) as Executed from CTCL_EQUITY.dbo.ScriptTrans as mw left join CTCL_EQUITY.dbo.MarketWatchLadder as mwl on mw.ClientCode=mwl.ClientCode and mw.DBID=mwl.DBID  where mw.ClientCode=" + this.state.Userid + " order by mw.ClientCode,mw.DBId"
        const response1 = await fetch('/api/ctcl_equity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query1, type: "select" }),
        }).then((result1) => result1.json()) // here
            .then((result1) => {
                if (result1 && result1['data']) {
                    return result1['data']
                }
            })

        let tempSymbol1 = response1
        if (tempSymbol1 && tempSymbol1.length > 0) {

            const endresult = Object.values(tempSymbol1.reduce((value, object) => {
                let Pending = 0
                if (value[object.IndexN]) {
                    if (object.Executed === 0) {
                        Pending = Pending + 1;
                    }
                    value[object.IndexN].UserID = object.UserID;
                    value[object.IndexN].DBID = object.DBID;
                    value[object.IndexN].Token = object.Token;
                    value[object.IndexN].Symbol = object.Symbol;
                    value[object.IndexN].PriceGap = object.PriceGap;
                    value[object.IndexN].Quantity = object.Quantity;
                    value[object.IndexN].StopBuy = object.StopBuy;
                    value[object.IndexN].StopTrade = object.StopTrade ? 1 : 0;
                    value[object.IndexN].LastBoughtPrice = object.LastBoughtPrice;
                    value[object.IndexN].LastSoldPrice = object.LastSoldPrice;
                    value[object.IndexN].TotalPosition = object.TotalPosition;
                    value[object.IndexN].LastBoughtQty = object.LastBoughtQty;
                    value[object.IndexN].LastSoldQty = object.LastSoldQty;
                    value[object.IndexN].LastBoughtTime = object.LastBoughtTime;
                    value[object.IndexN].LastSoldTime = object.LastSoldTime;
                    value[object.IndexN].QtyFilled = object.QtyFilled;
                    value[object.IndexN].Multiplier = object.Multiplier;
                    value[object.IndexN].count = value[object.IndexN].count++;
                    value[object.IndexN].Pending = Pending;

                } else {
                    if (object.Executed === 0) {
                        Pending = Pending + 1;
                    }
                    value[object.IndexN] = {
                        ...object, count: 1,
                        "UserID": object.UserID,
                        "DBID": object.DBID,
                        "Token": object.Token,
                        "Symbol ": object.Symbol,
                        "PriceGap": object.PriceGap,
                        "Quantity": object.Quantity,
                        "StopBuy": object.StopBuy,
                        "StopTrade": object.StopTrade ? 1 : 0,
                        "LastBoughtPrice": object.LastBoughtPrice,
                        "LastSoldPrice": object.LastSoldPrice,
                        "TotalPosition": object.TotalPosition,
                        "LastBoughtQty": object.LastBoughtQty,
                        "LastSoldQty": object.LastSoldQty,
                        "LastBoughtTime": object.LastBoughtTime,
                        "LastSoldTime": object.LastSoldTime,
                        "QtyFilled": object.QtyFilled,
                        "Multiplier": object.Multiplier,
                        "Pending": Pending
                    };
                }
                return value;
            }, {}));
            console.log(endresult)
            let MTM = await GetMTM(this.state.Userid).then((res) => {
                return res ? res : []
            })
            console.log(MTM)
            this.setState({ strategyArray: endresult, AllStrategy: tempSymbol1, netPnlDetails: MTM });
            console.log(this.state.strategyArray)
        }
    }
    onAddClick = async (token, price, qty, Multiplier) => {

        let filteredSymbol = this.state.symbolList.filter((value) => {
            if (value['value'] === token) {
                return value['label'];
            }
        });

        if (token && price && qty && Multiplier) {
            if (parseInt(price) >= parseInt(Multiplier)) {
                let Symbol = filteredSymbol[0]['label'];
                await fetch('/api/ctcl_equity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: "select COUNT(*) as COUNT from ScriptTrans where ClientCode=" + this.state.Userid + " ", type: "select" }),
                }).then((result) => result.json()) // here
                    .then(async (result) => {
                        if (result && result["data"]) {
                            if (parseInt(result["data"][0]["COUNT"]) < 10) {
                                let response = await InsertSymbol(token, Symbol, this.state.Userid, qty, price, this.state.UserName, Multiplier)
                                if (response) {
                                    if (response === 2) {
                                        toast.success(Symbol + " Added Successfully...")
                                        this.fetchAllSymbol()
                                    }
                                    else if (response === 1) {
                                        toast.error("Symbol Already Exist....")
                                    }
                                }
                            }
                            else {
                                toast.warn("Maximum 10 Symbol can be Added...")
                            }
                        }
                    })
            }
            else {
                toast.error("Price Gap must be greater than or Equal to Multiplier.. ")
            }
        }
        else {
            toast.error("Please Fill All details...")
        }

    }
    handleChange = (e) => {

        this.setState({ [e.target.name]: e.target.value });

    }
    onStopAllClick = async () => {
        let updateResponse = await setGlobalStop(this.state.Userid).then((res) => {
            return res ? res : []
        })
        if (updateResponse === 1) {
            this.setState({ StopAll: !(this.state.StopAll) })
        }
    }
    updateStrategy = async (index, userid, Dbid, Token, Symbol) => {
        let Price = "", Qty = "", tempstopBuy = "", tempstopTrade = "", stopbuy = 0, stoptrade = 0, Multiplier = 0
        Price = document.getElementsByName(`rowPrice${index}`)[0]['value'];
        Multiplier = document.getElementsByName(`Multiplier${index}`)[0]['value'];
        Qty = document.getElementsByName(`rowQty${index}`)[0]['value'];
        tempstopBuy = document.getElementsByName(`StopBuy${index}`)[0]['checked'];
        tempstopTrade = document.getElementsByName(`StopTrade${index}`)[0]['checked'];
        if (tempstopBuy === false) {
            stopbuy = 0
        }
        else {
            stopbuy = 1
        }
        if (tempstopTrade === false) {
            stoptrade = 0
        }
        else {
            stoptrade = 1
        }
        if (parseInt(Price) >= parseInt(Multiplier)) {

            let updateResponse = await UpdateStrategy(parseFloat(Price * 100).toFixed(2), Qty, stopbuy, stoptrade, userid, Dbid, Token, parseFloat(Multiplier * 100).toFixed(2)).then((res) => {
                return res ? res : []
            })


            if (updateResponse === 1) {
                this.setState({ [`StopBuy${index}`]: "", [`StopTrade${index}`]: "", })
                this.fetchAllSymbol()
                toast.success(Symbol + " updated successfully...")
            }
        }
        else {
            toast.warn("Price Gap should be greater than or equal to Multiplier...")
        }
        // console.log(Price + " " + Qty + " " + stopbuy + " " + stoptrade + " " + userid + " " + Dbid + " " + Token)
    }
    selectedShowDepthSymbol = async (token, Symbol) => {

        this.setState({ selDepthToken: token }, async () => {
            const detphArray = await fetchDepthDetails(token)
                .then(function (result) {
                    console.log(JSON.stringify(result))
                    return result ? result : [];
                }).catch((err) => { console.log(err) });
            if (detphArray && detphArray.length > 0) {
                let tempBid = [], tempAsk = [], tempDepthDetails = {}
                tempBid[0] = { 'bid': detphArray[0]['BuyPrice1'], 'qty': detphArray[0]['BuyQty1'], }
                tempBid[1] = { 'bid': detphArray[0]['BuyPrice2'], 'qty': detphArray[0]['BuyQty2'], }
                tempBid[2] = { 'bid': detphArray[0]['BuyPrice3'], 'qty': detphArray[0]['BuyQty3'], }
                tempBid[3] = { 'bid': detphArray[0]['BuyPrice4'], 'qty': detphArray[0]['BuyQty4'], }
                tempBid[4] = { 'bid': detphArray[0]['BuyPrice5'], 'qty': detphArray[0]['BuyQty5'], }
                tempAsk[0] = { 'ask': detphArray[0]['SellPrice1'], 'qty': detphArray[0]['SellQty1'], }
                tempAsk[1] = { 'ask': detphArray[0]['SellPrice2'], 'qty': detphArray[0]['SellQty2'], }
                tempAsk[2] = { 'ask': detphArray[0]['SellPrice3'], 'qty': detphArray[0]['SellQty3'], }
                tempAsk[3] = { 'ask': detphArray[0]['SellPrice4'], 'qty': detphArray[0]['SellQty4'], }
                tempAsk[4] = { 'ask': detphArray[0]['SellPrice5'], 'qty': detphArray[0]['SellQty5'], }
                // let tempLTT = detphArray[0]['LTT'] > 0 ? `${new Date(detphArray[0]['LTT']).getDate()}/${new Date(detphArray[0]['LTT']).getMonth() + 1}/${new Date(detphArray[0]['LTT']).getFullYear()}  ${(new Date(detphArray[0]['LTT']).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: "2-digit", })).toString().replace("UTC", "")}` : `${new Date().getDate()}/${new Date().getMonth() + 1}/${new Date().getFullYear()}  ${(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: "2-digit", })).toString().replace("UTC", "")}`
                tempDepthDetails = {
                    // "OPEN": parseFloat(detphArray[0]['OPEN']).toFixed(2), "HIGH": parseFloat(detphArray[0]['HIGH']).toFixed(2), "LOW": parseFloat(detphArray[0]['LOW']).toFixed(2), "CLOSE": parseFloat(detphArray[0]['CLOSE']).toFixed(2),
                    "VTT": detphArray[0]['VTT'], "LTQ": parseFloat(detphArray[0]['LTQ']).toFixed(2), "LTP": parseFloat(detphArray[0]['LTP']).toFixed(2),
                }

                let tempBidTotalQty = tempBid.reduce(function (a, b) {
                    return a + parseInt(b['qty']);
                }, 0);
                let tempAskTotalQty = tempAsk.reduce(function (a, b) {
                    return a + parseInt(b['qty']);
                }, 0);
                this.setState({ selectedDepthSymbol: Symbol, bid: tempBid, ask: tempAsk, totalDepthBuyQty: tempBidTotalQty, totalDepthSellQty: tempAskTotalQty, selDepthDetails: tempDepthDetails },
                    () => { console.log(tempDepthDetails) }
                )
            }
            else {
                toast.warn("No record found for this Leg  ")
            }
        })
    }
    handleTableCellChange = (evt, name) => {
        //const value = evt.currentTarget.innerHTML
        const value = evt.target.value
        if (value) {
            this.setState({ [name]: value })

        }
        else {
            this.setState({ [name]: "" })
        }
        //console.log(evt.currentTarget.innerHTML)
        console.log("Name : " + name + " Value : " + value)

    }
    onTableCheckBoxChange = (name, value) => {
        console.log(value)
        this.setState({ [name]: value })
        /* if (String(name).match("StopTrade")) {
             let count = 0;
             let length = this.state.strategyArray.length;
             for (let i = 0; i < length; i++){
                 if (this.state.strategyArray[i]["StopTrade"]===1) {
                     
                 }
             }
             // console.log(length)
         }*/
        console.log(name + " " + value)
        // this.setState({ [name]: value }, () => { console.log(name + " " + this.state[name]) });
    }
    playSound = async () => {
        let query = "select * from CTCL_EQUITY.dbo.ScriptTrans where ClientCode=" + this.state.Userid + ""
        // let msg = ""
        await fetch('/api/ctcl_equity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query, type: "select" }),
        }).then((result) => result.json()) // here
            .then(async (result) => {


                if (result && result['data']) {
                    let len = (result['data']).length
                    for (let i = 0; i < len; i++) {
                        if (result['data'][i]['Notification'] == 1) {

                            // msg.text = "Raam Raam"
                            // msg.lang = "hi-IN";
                            //  window.speechSynthesis.speak(msg)


                            console.log(result['data'][i]?.DBId)
                            let res = await updateNotification(result['data'][i]['ClientCode'], (result['data'][i]?.DBId), result['data'][i]['Token'],);
                            if (res == 1) {
                                if ('speechSynthesis' in window) {
                                    let msg = new window.SpeechSynthesisUtterance()
                                    let voicesArray = window.speechSynthesis.getVoices()
                                    msg.voice = voicesArray[2]
                                    msg.text = "Raam Raam"
                                    msg.lang = "hi-IN";
                                    window.speechSynthesis.speak(msg)
                                    // window.speechSynthesis.speak(
                                    //    new SpeechSynthesisUtterance('')
                                    // )
                                }
                                else{
                                    if (Capacitor.isNativePlatform()) {
                                    // do something
                                  
                                    await TextToSpeech.speak({
                                      text: 'Raam Raam',
                                      lang: 'hi-IN',
                                      rate: 1.0,
                                      pitch: 1.0,
                                      volume: 1.0,
                                      category: 'ambient',
                                    }); 
                                    //alert("Played 2")
                                  }
                                  else{
                                    await TextToSpeech.speak({
                                      text: 'Raam Raam',
                                      lang: 'hi-IN',
                                      rate: 1.0,
                                      pitch: 1.0,
                                      volume: 1.0,
                                      category: 'ambient',
                                    });
                                   // alert("Played 0")
                                  }
                                  }
                                console.log("updated")
                            } else {
                                console.log("error")
                            }
                        }
                        else if (result['data'][i]['Notification'] == 2) {
                            // else {


                            let res = await updateNotification(result['data'][i]['ClientCode'], (result['data'][i]?.DBId), result['data'][i]['Token'],);
                            if (res == 1) {
                                if ('speechSynthesis' in window) {
                                    let msg = new window.SpeechSynthesisUtterance()
                                    let voicesArray = window.speechSynthesis.getVoices()
                                    msg.voice = voicesArray[2]
                                    msg.text = "Radhey  Radhey"
                                    msg.lang = "hi-IN";
                                    window.speechSynthesis.speak(msg)
                                    // window.speechSynthesis.speak(
                                    //    new SpeechSynthesisUtterance('')
                                    // )
                                }
                                else{
                                    if (Capacitor.isNativePlatform()) {
                                    // do something
                                  
                                    await TextToSpeech.speak({
                                      text: 'Radhey Radhey',
                                      lang: 'hi-IN',
                                      rate: 1.0,
                                      pitch: 1.0,
                                      volume: 1.0,
                                      category: 'ambient',
                                    }); 
                                    //alert("Played 2")
                                  }
                                  else{
                                    await TextToSpeech.speak({
                                      text: 'Radhey Radhey',
                                      lang: 'hi-IN',
                                      rate: 1.0,
                                      pitch: 1.0,
                                      volume: 1.0,
                                      category: 'ambient',
                                    });
                                    //alert("Played 0")
                                  }
                                  }
                                // console.log("updated")
                            } else {
                                console.log("error")
                            }
                        }
                    }
                }



            })

    }
    componentDidMount() {
        /* if ('speechSynthesis' in window) {
             window.speechSynthesis.speak(
                 new SpeechSynthesisUtterance('hello')
             )
         }
         window.speechSynthesis.speak(
             new SpeechSynthesisUtterance('hello')
         )*/
        /* const msg = new SpeechSynthesisUtterance()
         msg.text = "Radhey  Radhey "
         //msg.text = "Raam Raam"
         msg.lang = "hi-IN";
         window.speechSynthesis.speak(msg)*/

        // alert("spoken")
        setInterval(() => {
            // this.get_client()
            this.playSound()
            if (this.state.selDepthToken !== "" && this.state.showDepthModalVisible) {
                this.selectedShowDepthSymbol(this.state.selDepthToken)
            }

        }, 10000)
        setInterval(() => {
            if (this.state.refreshToggle) {
                this.fetchAllSymbol()
            }
        }, 1000)

    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }
    get_client = async () => {
        let url = "/api/auth/get_user"
        const res = await fetch("/api/auth/get_user", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((result) => result.json()) // here
            .then((result) => {
                console.log(result)
                return result
            })
        //  console.log(Router.router.query["client"])
        //  let ClientiD = Router.router?.query["client"]
        if (res["data"] && (res["data"]["usercode"])) {
            this.setState({ Userid: res["data"]["userid"], UserCode: res["data"]["usercode"], UserName: res["data"]["username"] }, () => {
                console.log(this.state.Userid + " " + this.state.UserCode + " " + this.state.UserName)
                this.fetchAllSymbol()
                /* if (!this.state.Userid) {
                    Router.router.push("/")
                }*/
            })
        } else {
            Router.router.push("/")
        }
    }
    renderRowExpanded = (rowData) => {
        if (this.state.AllStrategy) {
            let count_row = 0;
            let notFound = 0;
            const getTime = (date) => {
                const d = new Date(date);
                d.setHours(d.getHours() - 5);
                d.setMinutes(d.getMinutes() - 30);
                const dd = [d.getHours(), d.getMinutes(), d.getSeconds()].map((a) => (a < 10 ? '0' + a : a));
                return dd.join(':');
            };
            // if (this.state.AllStrategy['BsFlag'] !== 0 && this.state.AllStrategy['Price'] !== 0 && this.state.AllStrategy['qty'] !== 0 && this.state.AllStrategy['InsertTime'] !== '')
            return <div style={{ fontWeight: 'bold', backgroundColor: "#ffffff" }}>

                <div className='relative overflow-x-auto mt-4 '>

                    <table className='table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>

                        <thead className='text-xs text-white uppercase bg-red-400 dark:bg-gray-700 dark:text-gray-400'>
                            <tr >
                                <th scope="col" className="px-2 py-2 rounded-s-lg">
                                    Price
                                </th>
                                {/*   <th scope="col" className="px-6 py-3 ">
                                    PriceGap
        </th>*/}
                                <th scope="col" className="px-2 py-2 ">
                                    Qty
                                </th>
                                <th scope="col" className="px-2 py-2 ">
                                    Traded Qty
                                </th>
                                {/* <th scope="col" className="px-2 py-2 ">
                                    Pending Price
                                </th>
                                <th scope="col" className="px-2 py-2 ">
                                    Pending Qty
                                </th>*/}
                                <th scope="col" className="px-2 py-2 ">
                                    Status
                                </th>
                                <th scope="col" className="px-2 py-2 rounded-e-lg">
                                    Last Traded Time
                                </th>
                            </tr>
                        </thead>
                        <tbody>

                            {this.state.AllStrategy.map((data, index) => {
                                if (data.IndexN === rowData.IndexN && (this.state.AllStrategy[index]['BsFlag'] !== 0)) {
                                    // let InsertTime = `${new Date(data.InsertTime).getDate()}/${new Date(data.InsertTime).getMonth() + 1}/${new Date(data.InsertTime).getFullYear()}  ${(new Date(data.InsertTime).toLocaleTimeString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })).toString()}`;
                                    let InsertTime = `${new Date(data.InsertTime).getDate()}/${new Date(data.InsertTime).getMonth() + 1}/${new Date(data.InsertTime).getFullYear()} ${getTime(data.InsertTime)}`;

                                    //  if (this.state.AllStrategy[index]['BsFlag'] !== 2 ) {
                                    if (this.state.AllStrategy[index]['BsFlag'] !== 2 && (this.state.AllStrategy[index]['Executed'] === 1)) {
                                        count_row = count_row + 1;
                                        return (
                                            <tr key={index} className='bg-white border-b dark:bg-gray-800'>
                                                <td scope="row" className="px-2 py-2 ">
                                                    {parseFloat(data.Price / 100).toFixed(2)
                                                        // this.state.AllStrategy[index]['Executed'] == 0 ? 0.00 : parseFloat(data.Price / 100).toFixed(2)
                                                    }
                                                </td>
                                                {/* <td className="px-6 py-4">
                                                    {parseFloat(data.PriceGap / 100).toFixed(2)}
                                                </td>*/}
                                                <td className="px-2 py-2">
                                                    {data.qty}
                                                </td>
                                                <td className="px-2 py-2">
                                                    {data.QtyFilled}
                                                </td>

                                                {/*  <td className="px-6 py-2">
                                                    {this.state.AllStrategy[index]['Executed'] == 0 ? parseFloat(data.Price / 100).toFixed(2) : 0.00}
                                                </td>
                                                <td className="px-6 py-2">
                                                    {this.state.AllStrategy[index]['Executed'] == 0 ? data.qty : 0}
                                                </td>*/}
                                                <td className={`px-2 py-2 ${(data.Price > 0 && data.qty === data.QtyFilled) ? " text-green-400 font-bold" : (parseInt(data.Executed) === -5 ? "text-red-400 font-bold" : "text-orange-400 font-bold")}`}  >
                                                    {/*<span className='px-2 py-2 border-2 bg-slate-100 rounded-lg border-slate-300'>*/}
                                                    {(data.Price > 0 && data.qty === data.QtyFilled) ? "Fully Traded" : (parseInt(data.Executed) === -5 ? "Rejected" : "Pending")}
                                                    {/*</span>*/}

                                                </td>
                                                <td className="px-2 py-2 ">
                                                    {InsertTime}
                                                </td>

                                            </tr>

                                        );
                                    }
                                }
                                else {
                                    //notFound = 1;
                                }
                            })

                            }
                            {(this.state.AllStrategy.length === 0) && <tr><td colspan="3" style={{ textAlign: 'center' }}>No Data Found </td></tr>
                            }

                        </tbody>
                        {/* <tfoot>
                            <tr class="font-semibold text-gray-900 dark:text-white">
                                <th scope="row" class="px-6 py-3 text-base"> Total</th>
                                <td class="px-6 py-3">3</td>

                            </tr>
                        </tfoot>*/}

                    </table>

                    {/*<div style={{ visibility: "hidden" }}>
                        <span style={{ color: "#000", fontWeight: "bold" }}>  gfhffnf  sddfb  Total Rows : {count_row} </span>
                        </div>*/}
                </div>
            </div >
        }

    };
    handleExpanded = (rowData, dataKey) => {
        let open = false;
        const nextExpandedRowKeys = [];

        this.state.expandedRowKeys.forEach(key => {
            if (key === rowData[rowKey]) {
                open = true;
            } else {
                nextExpandedRowKeys.push(key);
            }
        });

        if (!open) {
            nextExpandedRowKeys.push(rowData[rowKey]);
        }
        this.setState({ expandedRowKeys: nextExpandedRowKeys })
        // this.onHandleChange('expandedRowKeys', nextExpandedRowKeys)
        // setExpandedRowKeys(nextExpandedRowKeys);
    };

    logout = async () => {
        /*const auth_api = await fetch('/api/auth/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            //body: JSON.stringify({ query: tempQuery, type: "select" }),
        })
            .then((result) => result.json()) // here
            .then((result) => { return result })
        if (auth_api) {
            Router.router.push("/")
        }*/
        localStorage.setItem("User", "")
        localStorage.removeItem("User")
        Router.router.push("/")
        window.location.href = "http://103.93.94.120:80/"
    }
    render() {
        // this.get_client()

        const Filter_OrderBook = this.state.OrderBook.filter((obj, i) => {
            if ((obj.OrderStatus && obj.OrderStatus.includes(this.state.selOrdStatus)) && ((obj.Symbol && obj.Symbol.includes(this.state.selSymbol)))) {
                console.log(obj)
                return obj;
            }
        })

        return (
            <div>
                <ToastContainer />


                <nav className="min-h-[4rem] sticky top-0  col-[1/-1] row-[1] z-10 backdrop-blur-lg flex justify-between items-center bg-white-600 text-[#000] text-xl font-bold shadow-[rgba(0,_0,_0,_0.3)_0px_15px_12px] my-0">
                    <div className='px-4'> Hello {this.state.UserName}</div>
                    <div className='px-4'>

                        {/* <button type="button" className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={this.logout}>Logout</button>*/}

                        <Nav appearance="subtle" onSelect={(key) => {
                            this.setState({ activateKey: key ? key : 1 }, () => {
                                if (this.state.activateKey === 2) {
                                    this.fetchOrderBook()
                                }
                                else if (this.state.activateKey === 3) {
                                    this.fetchTradeBook()
                                }
                            })
                        }} activeKey={this.state.activateKey ? this.state.activateKey : this.state.activateKey}>
                            <Nav.Menu title="Dashboard" active={this.state.activateKey} >

                                <Nav.Item eventKey={1} style={{ fontSize: 16, paddingTop: "5px", fontWeight: "bold", color: "#000" }}>Ladder Details</Nav.Item>

                                <Nav.Item eventKey={4} onClick={() => { this.setState({ openModal: true }) }} style={{ fontSize: 16, paddingTop: "5px", fontWeight: "bold", color: "#000" }}>Add Symbol</Nav.Item>
                                <Nav.Item eventKey={2} style={{ fontSize: 16, paddingTop: "5px", fontWeight: "bold", color: "#000" }} >Order Book</Nav.Item>
                                <Nav.Item eventKey={3} style={{ fontSize: 16, paddingTop: "5px", fontWeight: "bold", color: "#000" }}>Trade Book</Nav.Item>
                                <Nav.Item eventKey={5} style={{ fontSize: 16, paddingTop: "5px", fontWeight: "bold", color: "#000" }}>Trades Details</Nav.Item>
                                <Nav.Item eventKey={6} onClick={() => { this.logout() }} style={{ fontSize: 16, paddingTop: "5px", fontWeight: "bold", color: "#000" }}>Sign Out</Nav.Item>
                            </Nav.Menu>
                        </Nav>


                    </div>
                </nav >
                <main style={{ backgroundColor: "#ffffff" }} className='h-screen flex flex-col px-1 py-12'>
                    <Modal1 size={"xs"} open={this.state.openModal} onClose={() => { this.setState({ openModal: false, activateKey: 1 }) }}>
                        <Modal1.Header>
                            <Modal1.Title>Add Symbol</Modal1.Title>
                        </Modal1.Header>
                        <Modal1.Body>
                            <div className="shadow-[rgba(0,_0,_0,_0.3)_0px_15px_12px] border-solid border-2 border-[rgba(0, 0, 0, 0.3)] rounded-[8px] px-6 py-6 " >
                                <div className={styles.legGrid} >
                                    <div style={{ width: "auto", padding: '15px' }} className='font-bold text-base text-[#000]' >Select Symbol</div>
                                    <div style={{ width: "auto", padding: '5px' }} >
                                        <InputPicker virtualized placeholder='Symbol' data={this.state.symbolList} name={'token'} value={this.state.token} onChange={(value, e) => { this.setState({ token: value }); console.log(value) }} onSelect={(value, e) => { this.setState({ token: value }); console.log(value) }} onClean={() => { this.setState({ token: "" }) }} style={{ width: 224 }} />
                                    </div>
                                    <div style={{ width: "auto", padding: '15px' }} className='font-bold text-base text-[#000]'>Multiplier {/*<span style={{ color: "#000", fontSize: 14, fontWeight: "bold" }}> (In Rupees)</span>*/}</div>
                                    <div style={{ width: "auto", padding: '5px' }}>
                                        <InputNumber size="md" placeholder="Multiplier" width={'90%'} style={{ textAlign: "right" }} type='number' name={'Multiplier'} value={this.state.Multiplier ? this.state.Multiplier : ""} onChange={(value) => { value > 0 ? this.setState({ Multiplier: value }) : this.setState({ Multiplier: 0 }) }} />

                                    </div>
                                    <div style={{ width: "auto", padding: '15px' }} className='font-bold text-base text-[#000]'>Price Gap <span style={{ color: "#000", fontSize: 14, fontWeight: "bold" }}> (In Rupees)</span></div>
                                    <div style={{ width: "auto", padding: '5px' }}>
                                        <InputNumber size="md" placeholder="Price" width={'90%'} style={{ textAlign: "right" }} type='number' name={'price'} value={this.state.Price ? this.state.Price : ""} onChange={(value) => { value > 0 ? this.setState({ Price: value }) : this.setState({ Price: 0 }) }} />

                                    </div>
                                    <div style={{ width: "auto", padding: '15px' }} className='font-bold text-base text-[#000]'>QTY</div>
                                    <div style={{ width: "auto", padding: '5px' }}>
                                        <InputNumber size="md" placeholder="Qty" width={'90%'} type='number' name={'qty'} value={this.state.Qty ? this.state.Qty : ""} onChange={(value) => { value > 0 ? this.setState({ Qty: value }) : this.setState({ Qty: 0 }) }} />

                                    </div>
                                    <div style={{ width: "auto", padding: '5px' }}> <button type="button" className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => { this.onAddClick(this.state.token, this.state.Price, this.state.Qty, this.state.Multiplier) }}>Add </button></div>
                                </div>


                            </div>
                        </Modal1.Body>
                        <Modal1.Footer>

                        </Modal1.Footer>
                    </Modal1>
                    {/*  <div className="shadow-[rgba(0,_0,_0,_0.3)_0px_15px_12px] border-solid border-2 border-[rgba(0, 0, 0, 0.3)] rounded-[8px] px-6 py-6 " >
                        <div className={styles.legGrid} >
                            <div style={{ width: "auto", padding: '15px' }} className='font-bold text-base text-[#000]' >Select Symbol</div>
                            <div style={{ width: "auto", padding: '5px' }} >
                                <InputPicker virtualized placeholder='Symbol' data={this.state.symbolList} name={'token'} value={this.state.token} onChange={(value, e) => { this.setState({ token: value }); console.log(value) }} onSelect={(value, e) => { this.setState({ token: value }); console.log(value) }} onClean={() => { this.setState({ token: "" }) }} style={{ width: 224 }} />
                            </div>
                            <div style={{ width: "auto", padding: '15px' }} className='font-bold text-base text-[#000]'>Price Gap <span style={{ color: "#000", fontSize: 14, fontWeight: "bold" }}> (In Rupees)</span></div>
                            <div style={{ width: "auto", padding: '5px' }}>
                                <InputNumber size="md" placeholder="Price" width={'90%'} style={{ textAlign: "right" }} type='number' name={'price'} value={this.state.Price ? this.state.Price : ""} onChange={(value) => { value > 0 ? this.setState({ Price: value }) : this.setState({ Price: 0 }) }} />

                            </div>
                            <div style={{ width: "auto", padding: '15px' }} className='font-bold text-base text-[#000]'>QTY</div>
                            <div style={{ width: "auto", padding: '5px' }}>
                                <InputNumber size="md" placeholder="Qty" width={'90%'} type='number' name={'qty'} value={this.state.Qty ? this.state.Qty : ""} onChange={(value) => { value > 0 ? this.setState({ Qty: value }) : this.setState({ Qty: 0 }) }} />

                            </div>
                            <div style={{ width: "auto", padding: '5px' }}> <button type="button" className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => { this.onAddClick(this.state.token, this.state.Price, this.state.Qty) }}>Add </button></div>
                        </div>


                    </div>*/}
                    {(this.state.activateKey === 1) && <div className="shadow-[rgba(0,_0,_0,_0.3)_0px_15px_12px] border-solid border-2 border-[rgba(0, 0, 0, 0.3)] rounded-[8px] px-2 py-3 flex-col " >
                        <div style={{ width: 'auto', padding: '5px' }} className='flex justify-between'>
                            <div>
                                <div>
                                    <span style={{ color: '#333', fontWeight: 'bold', fontSize: 18, paddingInline: "10px" }}>Auto Refresh  <Toggle value={this.state.refreshToggle} onChange={(value) => { this.setState({ refreshToggle: value }) }} /></span>
                                </div>
                            </div>
                            <div>
                                <span style={{ color: "#000", fontWeight: 'bold', fontSize: 18 }} > Net PNL :  <span style={{ color: this.CalcPnl() > 0 ? "green" : "red" }}>{this.CalcPnl() ? parseFloat(this.CalcPnl()).toFixed(2) : 0.00} </span>  </span>

                            </div>
                            {/*<button type="button" className={this.state.StopAll ? "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" : "text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"} onClick={() => { this.onStopAllClick() }}>Stop All </button>*/}


                        </div>

                        <div style={{ width: 'auto', padding: '5px' }}>

                            <Table height={this.state.strategyArray.length > 0 ? "auto" : 100} autoHeight={true} data={this.state.strategyArray} style={{ cursor: "pointer" }} hover={false}

                                rowClassName={(rowData) => {
                                    return rowData ? styles.rs_table_row_pending : "";
                                }}
                                bordered={true}
                                cellBordered={true}
                                headerHeight={65} rowHeight={43}
                                rowKey={rowKey}
                                expandedRowKeys={this.state.expandedRowKeys}
                                renderRowExpanded={this.renderRowExpanded}
                                rowExpandedHeight={(rowData) => {
                                    if (rowData && rowData?.count > 0) {
                                        let count = rowData?.count;
                                        return count * 200;
                                    }
                                    else { return 100; }
                                }}


                            >
                                <Column width={40} flexGrow={0} >
                                    <HeaderCell wordWrap='keep-all' align="center" style={{ background: "#1e90ff", color: "#ffffff", fontWeight: 'bold', fontSize: 15 }}>#</HeaderCell>
                                    <ExpandCell dataKey="IndexN" expandedRowKeys={this.state.expandedRowKeys} onChange={this.handleExpanded} />

                                </Column>


                                <Column width={'auto'} flexGrow={1} >
                                    <HeaderCell wordWrap='keep-all' align="center" style={{ background: "#1e90ff", color: "#ffffff", fontWeight: 'bold', fontSize: 15 }}>Symbol</HeaderCell>
                                    <CompactCell align="center" style={{ color: "#333", fontWeight: 'bold', }} >
                                        {(rowData) => <span style={{ fontSize: 15, fontWeight: 'bold' }}>{rowData['Symbol']}</span>
                                        }

                                    </CompactCell>

                                </Column>
                                <Column width={'auto'} flexGrow={1} >
                                    <HeaderCell wordWrap='keep-all' align="center" style={{ background: "#1e90ff", color: "#ffffff", fontWeight: 'bold', fontSize: 15 }}>
                                        Multiplier
                                    </HeaderCell>

                                    <EditableCell name="Multiplier" onTableCheckBoxChange={this.onTableCheckBoxChange} handleTableCellChange={this.handleTableCellChange} state={this.state} align="center" dataKey="Multiplier" style={{ color: "#333", fontWeight: 'bold', }} />

                                </Column>
                                <Column width={'auto'} flexGrow={1} >
                                    <HeaderCell wordWrap='keep-all' align="center" style={{ background: "#1e90ff", color: "#ffffff", fontWeight: 'bold', fontSize: 15 }}>
                                        <HeaderSummary top={"Price"} bottom={"Gap"}></HeaderSummary>
                                    </HeaderCell>

                                    <EditableCell name="rowPrice" onTableCheckBoxChange={this.onTableCheckBoxChange} handleTableCellChange={this.handleTableCellChange} state={this.state} align="center" dataKey="PriceGap" style={{ color: "#333", fontWeight: 'bold', }} />

                                </Column>
                                <Column width={'auto'} flexGrow={1} >
                                    <HeaderCell wordWrap='keep-all' align="center" style={{ background: "#1e90ff", color: "#ffffff", fontWeight: 'bold', fontSize: 15 }}>Qty</HeaderCell>
                                    <EditableCell name="rowQty" onTableCheckBoxChange={this.onTableCheckBoxChange} handleTableCellChange={this.handleTableCellChange} state={this.state} align="center" dataKey="Quantity" style={{ color: "#333", fontWeight: 'bold', }} />

                                </Column>
                                <Column width={'auto'} flexGrow={1} >
                                    <HeaderCell wordWrap='keep-all' align="center" style={{ background: "#1e90ff", color: "#ffffff", fontWeight: 'bold', fontSize: 15 }}>
                                        <HeaderSummary top={"Total"} bottom={"Position"}></HeaderSummary>
                                    </HeaderCell>
                                    <CompactCell align="center" style={{ color: "#333", fontWeight: 'bold', }} >
                                        {(rowData) => <span style={{ fontSize: 15, fontWeight: 'bold' }}>{rowData['TotalPosition']}</span>
                                        }

                                    </CompactCell>

                                </Column>
                                <Column width={'auto'} flexGrow={1} >
                                    <HeaderCell wordWrap='keep-all' align="center" style={{ background: "#1e90ff", color: "#ffffff", fontWeight: 'bold', fontSize: 15 }}>
                                        <HeaderSummary top={"Total"} bottom={"Pending"}></HeaderSummary>
                                    </HeaderCell>
                                    <CompactCell align="center" style={{ color: "#333", fontWeight: 'bold', }} >
                                        {

                                            (rowData) =>

                                                <span style={{ fontSize: 15, fontWeight: 'bold' }}>{rowData['Pending']}</span>

                                        }

                                    </CompactCell>

                                </Column>
                                <Column width={'auto'} flexGrow={1} >

                                    <HeaderCell wordWrap='keep-all' align="center" style={{ background: "#1e90ff", color: "#ffffff", fontWeight: 'bold', fontSize: 15 }}>
                                        <HeaderSummary top={"Stop"} bottom={"Buy"}></HeaderSummary>
                                    </HeaderCell>
                                    <EditableCell name="StopBuy" onTableCheckBoxChange={this.onTableCheckBoxChange} handleTableCellChange={this.handleTableCellChange} state={this.state} align="center" dataKey="StopBuy" style={{ color: "#333", fontWeight: 'bold', }} />

                                </Column>
                                <Column width={'auto'} flexGrow={1}  >
                                    <HeaderCell wordWrap='keep-all' align="center" style={{ background: "#1e90ff", color: "#ffffff", fontWeight: 'bold', fontSize: 15 }}>
                                        <HeaderSummary top={"Stop"} bottom={"Trade"}></HeaderSummary>
                                        {/* <CheckboxWordWrap top="Stop Trade" bottom={"Stop All Trade"} state={this.state} handleCheckAll={this.handleCheckAll} />*/}</HeaderCell>
                                    <EditableCell name="StopTrade" onTableCheckBoxChange={this.onTableCheckBoxChange} handleTableCellChange={this.handleTableCellChange} state={this.state} align="center" dataKey="StopTrade" style={{ color: "#333", fontWeight: 'bold', }} />

                                </Column>

                                <Column width={'auto'} flexGrow={2} >
                                    <HeaderCell wordWrap='keep-all' align="center" style={{ background: "#1e90ff", color: "#ffffff", fontWeight: 'bold', fontSize: 15 }}>Action</HeaderCell>
                                    <CompactCell align="center" style={{ color: "#333", fontWeight: 'bold' }} >
                                        {(rowData, rowIndex) =>
                                            <div style={{ width: 'auto' }} className='flex justify-evenly'>
                                                <span title="View Legs" style={{ alignSelf: 'center', alignContent: 'center', width: 'auto', cursor: 'pointer', paddingLeft: "2px" }} onClick={() => { this.selectedShowDepthSymbol(rowData['Token'], rowData['Symbol']); this.setState({ showDepthModalVisible: true }) }}><BsEyeFill fontWeight={"bold"} fontSize="25" style={{ alignSelf: 'center' }} color={"#1e90ff"} /></span>
                                                <span title="Update Row" style={{ alignSelf: 'center', alignContent: 'center', width: 'auto', cursor: 'pointer', paddingLeft: "2px" }} onClick={() => { this.updateStrategy(rowIndex, rowData["UserID"], rowData["DBID"], rowData["Token"], rowData["Symbol"]) }}><FaSave color="green" fontWeight={"bold"} fontSize="25" style={{ alignSelf: 'center', fontWeight: 'bold' }} /></span>

                                            </div>}
                                        {/*<span title="Delete Row" style={{ alignSelf: 'center', alignContent: 'center', width: 'auto', cursor: 'pointer', paddingLeft: "2px" }} onClick={() => { }}><MdDeleteForever color="red" fontWeight={"bold"} fontSize="25" style={{ alignSelf: 'center', fontWeight: 'bold' }} /></span>*/}
                                    </CompactCell>
                                </Column>

                            </Table>
                        </div>
                    </div>}
                    {
                        (this.state.activateKey === 2) && <div className="shadow-[rgba(0,_0,_0,_0.3)_0px_15px_12px] border-solid border-2 border-[rgba(0, 0, 0, 0.3)] rounded-[8px] px-2 py-3 flex-col " >
                            <div style={{ width: 'auto', padding: '5px' }}>
                                <span style={{ color: '#333', fontWeight: 'bold', fontSize: 21 }}>Order Book</span>
                            </div>
                            <div style={{ width: 'auto', padding: '5px' }}>

                                <span style={{ color: '#333', fontWeight: 'bold', fontSize: 18, }}> Filter By</span>

                                <div className={styles.legGrid} style={{ marginTop: 6 }}>
                                    <div style={{ width: 'auto', display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <div style={{ textAlign: "right", color: '#333', fontWeight: 'bold', fontSize: 14, }}>Symbol :  </div>
                                        <div style={{ width: "70%" }}>
                                            <InputPicker value={this.state.selSymbol} onSelect={(value) => { this.setState({ selSymbol: value }) }} onChange={(value) => { this.setState({ selSymbol: value }) }} size="sm" placeholder="Select Symbol" id={"Client"} style={{ width: "auto", color: "#000" }} onClean={() => { this.setState({ selSymbol: '' }) }} data={this.state.OrderSymolArray} />
                                        </div>
                                    </div>

                                    <div style={{ width: 'auto', display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                        <div style={{ textAlign: "right", color: '#333', fontWeight: 'bold', fontSize: 14, }}>Order Status :  </div>
                                        <div style={{ width: "70%" }}>
                                            <InputPicker value={this.state.selOrdStatus} onSelect={(value) => { this.setState({ selOrdStatus: value }) }} onChange={(value) => { this.setState({ selOrdStatus: value }) }} size="sm" placeholder="Select Order Status" id={"Client"} style={{ width: "auto", color: "#000" }} onClean={() => { this.setState({ selOrdStatus: '' }) }} data={this.state.OrderStatusArray} />
                                        </div>
                                    </div>

                                    {/* <div style={{ width: 'auto', padding: "5px", height: 'auto' }}>
                                    <button type="button" className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => { this.fetchOrderBook() }}>Submit </button>
                                        </div>*/}


                                </div>
                            </div>
                            <div className='px-0 mt-4'>
                                <div className='relative overflow-x-auto '>

                                    {/*<table className="sm:inline-table w-full flex flex-row sm:bg-white  overflow-hidden ">
                                    <thead className="text-black">

                                        {this.state.OrderBook.length > 0 && this.state.OrderBook.map((data, index) => (
                                            <tr
                                                className={`bg-teal-400 text-white flex flex-col sm:table-row mb-6 rounded-l-lg sm:rounded-none mb-2 sm:mb-0 ${index == 0 ? "sm:flex" : "sm:hidden"
                                                    }`}
                                                key={index}
                                            >
                                                <th className="py-3 px-5 text-left border border-b rounded-tl-lg sm:rounded-none">
                                                    Symbol
                                                </th>
                                                <th className="py-3 px-5 text-left border border-b">
                                                    OrderNumber
                                                </th>
                                                <th className="py-3 px-5 text-left border border-b"> Buy/Sell</th>
                                                <th className="py-3 px-5 text-left border border-b"> Volume</th>
                                                <th className="py-3 px-5 text-left border border-b"> Volume Filled today</th>
                                                <th className="py-3 px-5 text-left border border-b"> Price</th>
                                                <th className="py-3 px-5 text-left border border-t rounded-bl-lg sm:rounded-none ">
                                                    Order Status
                                                </th>

                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody className="flex-1 sm:flex-none">
                                        {this.state.OrderBook.map((data, index) => (
                                            <tr
                                                className="flex flex-col  sm:table-row mb-6 bg-white text-[#000]"
                                                key={index}
                                            >
                                                <td className="border hover:bg-[#222E3A]/[6%] sm:bg-white py-3 px-5">
                                                    {data.Symbol}
                                                </td>
                                                <td className="border hover:bg-[#222E3A]/[6%]  sm:bg-white py-3 px-5">
                                                    {data.OrderNumber
                                                        //parseFloat(data.PriceGap / 100).toFixed(2)
                                                    }
                                                </td>
                                                <td className="border hover:bg-[#222E3A]/[6%]  sm:bg-white py-3 px-5">
                                                    {data.BuySellIndicator === "B" ? "BUY" : "SELL"}
                                                </td>
                                                <td className="border hover:bg-[#222E3A]/[6%]  sm:bg-white py-3 px-5">
                                                    {data.Volume}
                                                </td>
                                                <td className="border hover:bg-[#222E3A]/[6%]  sm:bg-white py-3 px-5">
                                                    {data.VolumeFilledToday}
                                                </td>
                                                <td className="border hover:bg-[#222E3A]/[6%]  sm:bg-white py-3 px-5">
                                                    {parseFloat(data.Price).toFixed(2)}
                                                </td>
                                                <td className="border hover:bg-[#222E3A]/[6%]  sm:bg-white py-3 px-5 cursor-pointer">
                                                    {data.OrderStatus}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>*/}

                                    {<table className='table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>

                                        <thead className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
                                            <tr className='bg-red-400 text-white' >
                                                <th scope="col" className="px-2 py-2 rounded-s-lg">
                                                    Symbol

                                                </th>


                                                <th scope="col" className="px-2 py-2 ">
                                                    Buy/Sell
                                                </th>
                                                <th scope="col" className="px-2 py-2 ">
                                                    Qty
                                                </th>
                                                <th scope="col" className="px-2 py-2 ">
                                                    Traded Qty
                                                </th>
                                                <th scope="col" className="px-1 py-2">
                                                    Price
                                                </th>
                                                <th scope="col" className="px-2 py-2 ">
                                                    OrderNumber
                                                </th>
                                                <th scope="col" className="px-2 py-2 ">
                                                    Order Status
                                                </th>
                                                <th scope="col" className="px-2 py-2 rounded-e-lg">
                                                    Date/Time
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {this.state.OrderBook.length > 0 && Filter_OrderBook.map((data, index) => {

                                                return (
                                                    <tr key={index} className='bg-white border-b dark:bg-gray-800'>
                                                        <td scope="row" className="px-2 py-2">
                                                            {data.Symbol}
                                                        </td>

                                                        <td className="px-2 py-2">
                                                            {data.BuySellIndicator === "B" ? "BUY" : "SELL"}
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            {data.Volume}
                                                        </td>

                                                        <td className="px-2 py-2">
                                                            {data.VolumeFilledToday}
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            {parseFloat(data.Price).toFixed(2)}
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            {data.OrderNumber
                                                                //parseFloat(data.PriceGap / 100).toFixed(2)
                                                            }
                                                        </td>
                                                        <td className={`px-2 py-2   ${String(data.OrderStatus).match("Fully Traded") ? " text-green-400 font-bold border-solid " : (String(data.OrderStatus).match("Cancelled") ? "text-red-400 font-bold" : (String(data.OrderStatus).match("Confirmed") ? "text-sky-400 font-bold" : "text-amber-400 font-bold"))}`}>
                                                            {data.OrderStatus}

                                                        </td>
                                                        <td className="px-2 py-2">
                                                            {data.InsertTime}
                                                        </td>

                                                    </tr>

                                                );

                                            })

                                            }

                                        </tbody>
                                    </table>}
                                </div>
                            </div>
                        </div>
                    }
                    {
                        (this.state.activateKey === 3) && <div className="shadow-[rgba(0,_0,_0,_0.3)_0px_15px_12px] border-solid border-2 border-[rgba(0, 0, 0, 0.3)] rounded-[8px] px-2 py-3 flex-col " >
                            <div style={{ width: 'auto', padding: '5px' }}>
                                <span style={{ color: '#333', fontWeight: 'bold', fontSize: 21 }}>Trade Book</span>
                            </div>
                            <div style={{ width: 'auto', padding: '5px' }}>
                                <div className={styles.legGrid}>
                                    {/* <div style={{ width: 'auto', padding: '5px', color: "#000", fontWeight: 'bold', fontSize: 18, textAlign: "center" }}> From Date</div>
                                <div style={{ width: 'auto', padding: '5px' }}>
                                    <DatePicker oneTap defaultValue={this.state.fromDate ? this.state.fromDate : new Date()} onChange={(date) => { this.setState({ fromDate: date }) }} format={"dd-MMM-yyyy"} size="sm" style={{ width: "100%" }} placeholder='From Date' id={"FromDate"} name="FromDate" />

                                </div>
                                <div style={{ width: 'auto', padding: '5px', color: "#000", fontWeight: 'bold', fontSize: 18, textAlign: "center" }}> To Date</div>
                                <div style={{ width: 'auto', padding: '5px' }}>
                                    <DatePicker oneTap defaultValue={this.state.toDate ? this.state.toDate : new Date()} onChange={(date) => { this.setState({ toDate: date }) }} format={"dd-MMM-yyyy"} size="sm" style={{ width: "100%" }} placeholder='To Date' id={"ToDate"} name="ToDate" />

                                </div>

                                <div style={{ width: 'auto', padding: "5px", height: 'auto' }}>
                                    <button type="button" className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={() => { this.fetchTradeBook() }}>Submit </button>
                                    </div>*/}


                                </div>
                            </div>
                            <div className='px-0 mt-4'>
                                <div className='relative overflow-x-auto '>
                                    {/*<table className="sm:inline-table w-full flex flex-row sm:bg-white  overflow-hidden ">
                                    <thead className="text-black">

                                        {this.state.TradeBook.length > 0 && this.state.TradeBook.map((data, index) => (
                                            <tr
                                                className={`bg-teal-400 text-white flex flex-col sm:table-row mb-6 rounded-l-lg sm:rounded-none mb-2 sm:mb-0 ${index == 0 ? "sm:flex" : "sm:hidden"
                                                    }`}
                                                key={index}
                                            >
                                                <th className="py-3 px-5 text-left border border-b rounded-tl-lg sm:rounded-none">
                                                    Symbol
                                                </th>
                                                <th className="py-3 px-5 text-left border border-b">
                                                    Buy/Sell
                                                </th>
                                                <th className="py-3 px-5 text-left border border-b"> Trade Number</th>
                                                <th className="py-3 px-5 text-left border border-b"> Trade Price</th>
                                                <th className="py-3 px-5 text-left border border-b"> Traded Qty</th>
                                                <th className="py-3 px-5 text-left border border-t rounded-bl-lg sm:rounded-none ">
                                                    OriginalVolume
                                                </th>

                                            </tr>
                                        ))}
                                    </thead>
                                    <tbody className="flex-1 sm:flex-none">
                                        {this.state.TradeBook.map((data, index) => (
                                            <tr
                                                className="flex flex-col  sm:table-row mb-6 bg-white text-[#000]"
                                                key={index}
                                            >
                                                <td className="border hover:bg-[#222E3A]/[6%] sm:bg-white py-3 px-5">
                                                    {data.Symbol}
                                                </td>
                                                <td className="border hover:bg-[#222E3A]/[6%]  sm:bg-white py-3 px-5">
                                                    {data.BuySellIndicator === 1 ? "BUY" : "SELL"}
                                                </td>
                                                <td className="border hover:bg-[#222E3A]/[6%]  sm:bg-white py-3 px-5">
                                                    {data.FillNumber}
                                                </td>
                                                <td className="border hover:bg-[#222E3A]/[6%]  sm:bg-white py-3 px-5">
                                                    {parseFloat(data.FillPrice / 100).toFixed(2)}
                                                </td>
                                                <td className="border hover:bg-[#222E3A]/[6%]  sm:bg-white py-3 px-5">
                                                    {data.FillQuantity}
                                                </td>
                                                <td className="border hover:bg-[#222E3A]/[6%]  sm:bg-white py-3 px-5 cursor-pointer">
                                                    {data.OriginalVolume}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>*/}

                                    {<table className='table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>

                                        <thead className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
                                            <tr className='bg-red-400 text-white ' >
                                                <th scope="col" className="px-2 py-2 rounded-s-lg">
                                                    Symbol
                                                </th>

                                                <th scope="col" className="px-2 py-2 ">
                                                    Buy/Sell
                                                </th>
                                                <th scope="col" className="px-2 py-2 ">
                                                    Trade Number
                                                </th>
                                                <th scope="col" className="px-2 py-2">
                                                    Qty
                                                </th>
                                                <th scope="col" className="px-2 py-2 ">
                                                    Traded Qty
                                                </th>
                                                <th scope="col" className="px-2 py-2 ">
                                                    Traded Price
                                                </th>
                                                <th scope="col" className="px-2 py-2 rounded-e-lg">
                                                    Date/Time
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            {this.state.TradeBook.length > 0 && this.state.TradeBook.map((data, index) => {

                                                return (
                                                    <tr key={index} className='bg-white border-b dark:bg-gray-800'>
                                                        <td scope="row" className="px-1 py-2 ">
                                                            {data.Symbol}
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            {data.BuySellIndicator === 1 ? "BUY" : "SELL"}
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            {data.FillNumber}
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            {data.OriginalVolume}
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            {data.FillQuantity}
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            {parseFloat(data.FillPrice / 100).toFixed(2)}
                                                        </td>
                                                        <td className="px-2 py-2">
                                                            {data.InsertTime}
                                                        </td>

                                                    </tr>


                                                );

                                            })

                                            }

                                        </tbody>
                                    </table>}
                                </div>
                            </div>
                        </div>
                    }
                    {
                        (this.state.activateKey === 5) && <div className="shadow-[rgba(0,_0,_0,_0.3)_0px_15px_12px] border-solid border-2 border-[rgba(0, 0, 0, 0.3)] rounded-[8px] px-2 py-3 flex-col " >
                            <div style={{ width: 'auto', padding: '5px' }}>
                                <span style={{ color: '#333', fontWeight: 'bold', fontSize: 21 }}>Trades Details</span>
                            </div>
                            <div className='px-0 mt-4'>
                                <div className='relative overflow-x-auto '>


                                    {<table className='table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>

                                        <thead className='text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400'>
                                            <tr className='bg-red-400 text-white' >
                                                <th scope="col" className="px-6 py-3 rounded-s-lg">
                                                    Symbol

                                                </th>
                                                <th scope="col" className="px-6 py-3 ">
                                                    Price Gap
                                                </th>
                                                <th scope="col" className="px-6 py-3 ">
                                                    Qty
                                                </th>
                                                <th scope="col" className="px-6 py-3 rounded-e-lg">
                                                    Net Profit
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {this.state.netPnlDetails.length > 0 && this.state.netPnlDetails.map((data, index) => {
                                                return (
                                                    <tr key={index} className='bg-white border-b dark:bg-gray-800'>
                                                        <td scope="row" className="px-6 py-4 ">
                                                            {data.Symbol}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {parseFloat(data?.PriceGap / 100).toFixed(2)}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {data.Quantity}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {data.RGain}
                                                        </td>

                                                    </tr>

                                                );

                                            })

                                            }

                                        </tbody>
                                    </table>}
                                </div>
                            </div>
                        </div>
                    }

                    <Modal
                        visible={this.state.showDepthModalVisible}
                        width="100%"
                        height="85%"
                        effect="fadeInUp"
                        onClickAway={() => this.setState({ showDepthModalVisible: false })}

                    // overflow="auto"
                    >
                        <div style={{ height: "auto", display: 'flex', flexDirection: 'column', width: 'auto', }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', width: 'auto' }}>
                                    <div style={{ paddingLeft: "20px", paddingTop: "10px" }}><span style={{ fontSize: '20px', }}>{this.state.selectedDepthSymbol} </span></div>
                                    <div style={{ paddingLeft: "20px", paddingTop: '1px', display: 'flex', flexDirection: 'row' }}>
                                        <div ><span>{this.state.selDepthExchange}</span></div>
                                        <div style={{ paddingLeft: "5px", color: "#000000" }}><span style={{ color: "green" }}>{parseFloat(this.state.selDepthDetails.LTP / 100).toFixed(2)}</span></div>
                                        {/* <div style={{ paddingLeft: "5px", color: "#000000" }}><span > +7.20(+0.28%)</span></div>*/}
                                    </div>
                                </div>
                                <div> <span style={{ cursor: "pointer" }} onClick={() => { this.setState({ showDepthModalVisible: false }) }}><MdOutlineClose fontWeight={"bold"} fontSize="30" color={"red"} /></span></div>
                            </div>
                            <div><hr style={{ color: "#a4a4a4", backgroundColor: "#a4a4a4", height: 1.5, borderColor: "#a4a4a4" }}></hr></div>
                            <div style={{ display: 'flex', flexDirection: 'row', width: 'auto', paddingLeft: "20px", paddingTop: '2px' }} >
                                <div style={{ width: "50%", display: 'flex', flexDirection: 'column', }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', width: 'auto' }} >
                                        <div style={{ width: "50%" }}><span style={{ color: "#6d6c6c", fontWeight: "bold" }}>Qty</span></div>
                                        <div style={{ width: "50%" }}><span style={{ color: "#6d6c6c", fontWeight: "bold" }}>Bid</span></div>
                                    </div>
                                    {this.state.bid ? this.state.bid.map(row => (
                                        <div key={row} style={{ display: 'flex', flexDirection: 'row', width: 'auto' }} >
                                            <div style={{ width: "50%" }}><span style={{ color: "#09B2A0" }}>{row['qty']}</span></div>
                                            <div style={{ width: "50%" }}><span style={{ color: "#09B2A0" }}>{parseFloat(row['bid'] / 100).toFixed(2)}</span></div>
                                        </div>))
                                        : <></>}
                                    <div style={{ display: 'flex', flexDirection: 'row', width: 'auto' }} >
                                        <div style={{ width: "50%" }}><span style={{ color: "#09B2A0" }}>{this.state.totalDepthBuyQty}</span></div>
                                        <div style={{ width: "50%" }}><span style={{ color: "#09B2A0" }}>Total</span></div>
                                    </div>
                                </div>
                                <div style={{ width: "50%", display: 'flex', flexDirection: 'column', }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', width: 'auto' }} >
                                        <div style={{ width: "50%" }}><span style={{ color: "#6d6c6c", fontWeight: "bold" }}>Ask</span></div>
                                        <div style={{ width: "50%" }}><span style={{ color: "#6d6c6c", fontWeight: "bold" }}>Qty</span></div>
                                    </div>
                                    {this.state.bid ? this.state.ask.map(row => (
                                        <div key={row} style={{ display: 'flex', flexDirection: 'row', width: 'auto' }} >
                                            <div style={{ width: "50%" }}><span style={{ color: "red" }}>{parseFloat(row['ask'] / 100).toFixed(2)}</span></div>
                                            <div style={{ width: "50%" }}><span style={{ color: "red" }}>{row['qty']}</span></div>
                                        </div>))
                                        : <></>}
                                    <div style={{ display: 'flex', flexDirection: 'row', width: 'auto' }} >
                                        <div style={{ width: "50%" }}><span style={{ color: "red" }}>Total</span></div>
                                        <div style={{ width: "50%" }}><span style={{ color: "red" }}>{this.state.totalDepthSellQty}</span></div>
                                    </div>
                                </div>

                            </div>
                            <div style={{ width: 'auto' }}><div style={{ paddingLeft: '20px', paddingRight: '20px' }}><hr style={{ color: "#a4a4a4", backgroundColor: "#a4a4a4", height: 1.5, borderColor: "#a4a4a4" }}></hr></div></div>
                            <div style={{ width: 'auto', }}>
                                <div style={{ paddingLeft: '20px', paddingRight: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ justifyContent: 'center' }}> <span style={{ color: "#6d6c6c", fontWeight: "bold" }}>Open</span></div>
                                        <div> <span style={{ color: "#000000", paddingLeft: "2px" }}>{parseFloat(this.state.selDepthDetails.OPEN / 100).toFixed(2)}</span></div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ justifyContent: 'center' }}> <span style={{ color: "#6d6c6c", fontWeight: "bold" }}>High</span></div>
                                        <div> <span style={{ color: "#000000", paddingLeft: "2px" }}>{parseFloat(this.state.selDepthDetails.HIGH / 100).toFixed(2)}</span></div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ justifyContent: 'center' }}> <span style={{ color: "#6d6c6c", fontWeight: "bold" }}>Low</span></div>
                                        <div> <span style={{ color: "#000000", paddingLeft: "2px" }}>{parseFloat(this.state.selDepthDetails.LOW / 100).toFixed(2)}</span></div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ justifyContent: 'center' }}> <span style={{ color: "#6d6c6c", fontWeight: "bold" }}>Close</span></div>
                                        <div> <span style={{ color: "#000000", paddingLeft: "2px" }}>{parseFloat(this.state.selDepthDetails.CLOSE / 100).toFixed(2)}</span></div>
                                    </div>
                                </div>
                            </div>
                            <div style={{ width: 'auto' }}><div style={{ paddingLeft: '20px', paddingRight: '20px' }}><hr style={{ color: "#a4a4a4", backgroundColor: "#a4a4a4", height: 1.5, borderColor: "#a4a4a4" }}></hr></div></div>
                            <div style={{ width: 'auto', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ width: 'auto', background: '#e9e9e9', paddingLeft: '20px', paddingRight: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div ><span style={{ color: "#000000" }}> Volume</span></div>
                                    <div><span style={{ color: "#000000" }}> {this.state.selDepthDetails.VTT}</span></div>
                                </div>
                                {/* <div style={{ width: 'auto', background: '#FFFFFF', paddingLeft: '20px', paddingRight: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                        <div><span style={{ color: "#000000" }}> Max.Trade Price</span></div>
                                        <div><span style={{ color: "#000000" }}> 2561.96</span></div>
                                    </div>*/}
                                <div style={{ width: 'auto', background: '#e9e9e9', paddingLeft: '20px', paddingRight: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div><span style={{ color: "#000000" }}> Last Traded Quantity</span></div>
                                    <div><span style={{ color: "#000000" }}> {this.state.selDepthDetails.LTQ}</span></div>
                                </div>
                                {/*<div style={{ width: 'auto', background: '#FFFFFF', paddingLeft: '20px', paddingRight: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div><span style={{ color: "#000000" }}> Last Traded At</span></div>
                                    <div><span style={{ color: "#000000" }}> {this.state.selDepthDetails.LTT}</span></div>
                                </div>
                                <div style={{ width: 'auto', background: '#e9e9e9', paddingLeft: '20px', paddingRight: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div><span style={{ color: "#000000" }}> Lower Circuit</span></div>
                                    <div><span style={{ color: "#000000" }}> 2307.90</span></div>
                                </div>
                                <div style={{ width: 'auto', background: '#FFFFFF', paddingLeft: '20px', paddingRight: '20px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div><span style={{ color: "#000000" }}> Upper Circuit</span></div>
                                    <div><span style={{ color: "#000000" }}> 2820.70</span></div>
                                </div>*/}
                            </div>
                        </div>

                    </Modal>
                </main >
            </div >
        )
    }
}

export async function userLogin(userId, pwd) {
    let responseLogin = []
    let tempQuery = ""
    tempQuery = "select * from CTCL_EQUITY.dbo.User_Info where UserCode='" + userId + "'";

    console.log(tempQuery)
    await fetch('/api/ctcl_equity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: tempQuery, type: "select" }),
    }).then((result) => result.json()) // here
        .then((result) => {

            if (result['data'][0]) {
                // console.log(result['data'][0]['Password'])
                // console.log(pwd)
                if (String(result['data'][0]['Password']).match(pwd)) {
                    responseLogin[0] = 1
                    responseLogin[1] = result['data'][0]
                }
                else {
                    responseLogin[0] = 2
                }

            }
            else {
                responseLogin[0] = 3
            }


        }).catch((error) => {
            console.log(error)
            responseLogin[0] = 4
        });
    console.log(responseLogin)
    return responseLogin;
}
export async function InsertSymbol(token, symbol, userid, qty, price, Username, Multiplier) {
    let response = 0
    let tempQuery = ""
    tempQuery = "select COUNT(*) as COUNT from CTCL_EQUITY.dbo.ScriptTrans where Token=" + token + " and PriceGap=" + parseFloat(price * 100).toFixed(2) + " and ClientCode=" + userid + "";
    let DBID = 0
    console.log(tempQuery)
    await fetch('/api/ctcl_equity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: tempQuery, type: "select" }),
    }).then((result) => result.json()) // here
        .then(async (result) => {
            await fetch('/api/ctcl_equity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    //query: "select isnull(MAX(DBId),0) as DBID from CTCL_EQUITY.dbo.ScriptTrans where  ClientCode=" + userid + "", type: "select"
                    query: "select isnull(MAX(DBId),0) as DBID from CTCL_EQUITY.dbo.ScriptTrans ", type: "select"
                }),
            }).then((result1) => result1.json()) // here
                .then((result1) => {
                    if (result1 && result1['data']) {
                        DBID = parseInt(result1['data'][0]['DBID']) + 1
                    }
                })
            console.log(result)
            if (result['data'] && parseInt(result['data'][0]['COUNT']) > 0) {
                response = 1
            }
            else {
                //DBID = parseInt(result['data'][0]['DBID']) + 1
                //let query = "Insert into CTCL_EQUITY.dbo.MarketWatch(UserID,DBID,Symbol,Token,PriceGap,Quantity,StopBuy,StopTrade,LastBoughtPrice,LastSoldPrice,TotalPosition,LastBoughtQty,LastSoldQty,Notification,Inserted,UserName)values(" + userid + "," + DBID + ",'" + symbol + "'," + token + "," + price + "," + qty + ",0,0,0.00,0.00,0,0,0,0,1,'" + Username + "')"
                let query = "Insert into CTCL_EQUITY.dbo.ScriptTrans(ClientCode,DBId,Symbol,Token,PriceGap,Quantity,StopBuy,StopTrd,LastBoughtPrice,LastSoldPrice,TotalPosition,LastBoughtQty,LastSoldQty,Notification,Inserted,UserName,Subscribed,PendingBuy,PendingSell,Multiplier)values(" + userid + "," + DBID + ",'" + symbol + "'," + token + "," + parseFloat(price * 100).toFixed(2) + "," + qty + ",0,0,0.00,0.00,0,0,0,0,1,'" + Username + "',0,0,0," + parseFloat(Multiplier * 100).toFixed(2) + ")"
                console.log(query)
                await fetch('/api/ctcl_equity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: query, type: "insert" }),
                }).then((result2) => result2.json()) // here
                    .then((result2) => {
                        console.log(result2['data'])
                        if (result2 && result2['data'] === 1) {
                            response = 2
                        }
                        else {
                            response = 3
                        }
                    })
            }


        }).catch((error) => {
            console.log(error)

        });
    console.log(response)
    return response;

}
export async function fetchDepthDetails(token) {
    var selQuery = "select isnull(BuyPrice1,0) as BuyPrice1,isnull(BuyPrice2,0) as BuyPrice2,isnull(BuyPrice3,0) as BuyPrice3,isnull(BuyPrice4,0) as BuyPrice4,isnull(BuyPrice5,0) as BuyPrice5,isnull(BuyQty1,0) as BuyQty1,isnull(BuyQty2,0) as BuyQty2, isnull(BuyQty3,0) as BuyQty3,  isnull(BuyQty3,0) as BuyQty4, isnull(BuyQty5,0) as BuyQty5,isnull(SellPrice1,0) as SellPrice1,isnull(SellPrice2,0) as SellPrice2,isnull(SellPrice3,0) as SellPrice3,isnull(SellPrice4,0) as SellPrice4,isnull(SellPrice5,0) as SellPrice5,isnull(SellQty1,0) as SellQty1,isnull(SellQty2,0) as SellQty2,isnull(SellQty3,0) as SellQty3,isnull(SellQty4,0) as SellQty4,isnull(SellQty5,0) as SellQty5,isnull(VTT,0) as VTT,isnull(LTP,0) as LTP,isnull(LTQ,0) as LTQ from Ctcl_Equity.dbo.ScriptTrans where token=" + token + ""
    //console.log(selQuery)
    const depthDetails = await fetch('/api/ctcl_equity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: selQuery, type: "select" }),
    }).then((result) => result.json()) // here
        .then((result) => {
            // console.log(result)
            const tempArray = result['data'];
            return tempArray;

        }).catch((error) => {

        });
    //console.log(strategyDetails)
    return depthDetails;
}
export async function GetMTM(clientCode) {
    let selQuery = "select a.Instrument as Symbol,a.PriceGap,(case when  a.ExitQty>a.EntryQty then (a.ExitQty-a.EntryQty) else (a.EntryQty -a.ExitQty)end ) as Quantity,a.LTP,FORMAT(a.EntryTime,'dd/MMM/yyyy hh:mm:ss tt') as EntryTime,isnull(a.EntryQty,0) as EntryQty,Round(isNull(a.EntryPrice / 100, 0), 2) as EntryPrice,FORMAT(a.ExitTime,'dd/MMM/yyyy hh:mm:ss tt') as ExitTime , isnull(a.ExitQty, 0) as ExitQty, Round(isNull(a.ExitPrice / 100, 0), 2) as ExitPrice, a.TradeType, a.Status,((isnull(a.EntryQty, 0) * Round(isnull(a.EntryPrice / 100, 0), 2)) - (isnull(a.ExitQty, 0) * Round(isnull(a.ExitPrice / 100, 0), 2))) as Net, ((case when isnull(a.EntryQty, 0) > isnull(a.ExitQty, 0) then isnull(a.ExitQty, 0) else isnull(a.EntryQty, 0) end) * (Round(isNull(a.EntryPrice / 100, 0), 2) - Round(isNull(a.ExitPrice / 100, 0), 2)))  as RGain, (abs(isnull(a.EntryQty, 0) - isnull(a.ExitQty, 0)) * case when a.EntryPrice <>0 then (Round(isNull( a.EntryPrice / 100, 0), 2) - Round(isNull(a.LTP / 100, 0), 2)) else (Round(isNull( a.LTP / 100, 0), 2) - Round(isNull(a.ExitPrice / 100, 0), 2)) end) as URGain from(select max(tempc.LTP) as Ltp,MAX(st.PriceGap) as  PriceGap, rtrim(ord.Symbol) as Instrument, max(tc.Token) as Token, (case when max(tc.BuySellIndicator) = 2 then min(tc.InsertTime) end) as EntryTime, SUM(case when tc.BuySellIndicator = 2 then tc.FillQuantity * (1)  end) as EntryQty, sum(case when tc.BuySellIndicator = 2 then tc.FillPrice * (tc.FillQuantity)  end)/ SUM(case when tc.BuySellIndicator = 2 then tc.FillQuantity   end) as EntryPrice,  (case when min(tc.BuySellIndicator) = 1 then max(tc.InsertTime) end) as ExitTime,SUM(case when tc.BuySellIndicator = 1 then tc.FillQuantity * (1)  end) as ExitQty, sum(case when tc.BuySellIndicator = 1 then tc.FillPrice * (tc.FillQuantity)  end)/SUM(case when tc.BuySellIndicator = 1 then tc.FillQuantity   end)  as ExitPrice, max(ord.TriggerType) as TradeType, MAX(ord.OrderStatus) as Status from CTCL_EQUITY.dbo.TRADE_CONFIRM as tc left join CTCL_EQUITY.dbo.Orders as ord on tc.Token = ord.Token And Ord.Remarks = Tc.GoodTillDate left join CTCL_EQUITY.dbo.TEMPCONTRACT tempc on tc.Token = tempc.Token left join ScriptTrans as st on tc.AccountNumber=st.ClientCode and tc.Token=st.Token where tc.AccountNumber='" + clientCode + "' group by ord.symbol, ord.Token,st.DBId, rtrim(ord.AccountNumber),CAST(tc.InsertTime AS DATE) ) as a"
    // console.log(selQuery)
    const MtM = await fetch('/api/ctcl_equity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: selQuery, type: "select" }),
    }).then((result) => result.json()) // here
        .then((result) => {
            // console.log(result)
            const tempArray = result['data'] ? result['data'] : 0;
            return tempArray;

        }).catch((error) => {

        });

    return MtM;
}
export async function OrderBook(ClientId) {
    /*export async function OrderBook(ClientId, fromDate, ToDate) {
        var fromDate1 = new Date(fromDate).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
        var toDate1 = new Date(ToDate).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
       
       */
    let selQuery = "select Symbol,OrderNumber,BuySellIndicator,Volume,VolumeFilledToday,Price,OrderStatus,FORMAT(InsertTime,'dd/MMM/yyyy hh:mm:ss tt') as InsertTime from Ctcl_Equity.dbo.Orders where UserID=" + ClientId + ""
    //console.log(selQuery)
    const OrderDetails = await fetch('/api/ctcl_equity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: selQuery, type: "select" }),
    }).then((result) => result.json()) // here
        .then((result) => {
            // console.log(result)
            const tempArray = result['data'];
            return tempArray;

        }).catch((error) => {

        });

    return OrderDetails;
}
export async function TradeBook(ClientId) {
    /*export async function TradeBook(ClientId, fromDate, ToDate) {
       var fromDate1 = new Date(fromDate).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
       var toDate1 = new Date(ToDate).toLocaleDateString('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })
        let selQuery = "select Symbol,OrderNumber,BuySellIndicator,Volume,VolumeFilledToday,Price,OrderStatus from Ctcl_Equity.dbo.Orders where UserID=" + ClientId + "  and CAST(InsertTime as date) >='" + fromDate1 + "' and CAST(InsertTime as date) <='" + toDate1 + "' "
    */
    let selQuery = "select Symbol,FillNumber,FillPrice,BuySellIndicator,FillQuantity,OriginalVolume,FORMAT(InsertTime,'dd/MMM/yyyy hh:mm:ss tt') as InsertTime from Ctcl_Equity.dbo.TRADE_CONFIRM where AccountNumber='" + ClientId + "'"
    console.log(selQuery)
    const TradeDetails = await fetch('/api/ctcl_equity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: selQuery, type: "select" }),
    }).then((result) => result.json()) // here
        .then((result) => {
            // console.log(result)
            const tempArray = result['data'];
            return tempArray;

        }).catch((error) => {

        });

    return TradeDetails;
}
export async function setGlobalStop(ClientCode, Stop) {
    let response = 0
    let tempQuery = ""
    tempQuery = "select COUNT(*) as COUNT from CTCL_EQUITY.dbo.GlobalSettings where ClientCode=" + ClientCode + ""
    //console.log(tempQuery)
    await fetch('/api/ctcl_equity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: tempQuery, type: "select" }),
    }).then((result) => result.json()) // here
        .then(async (result) => {
            console.log(result)
            if (result['data'] && parseInt(result['data'][0]['COUNT']) > 0) {
                let query = "update CTCL_EQUITY.dbo.GlobalSettings set Stop=" + Stop + " where ClientCode=" + ClientCode + ""

                console.log(query)
                await fetch('/api/ctcl_equity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: query, type: "update" }),
                }).then((result1) => result1.json()) // here
                    .then((result1) => {
                        if (result1['data']) {

                            if (result1['data'] === 2) {
                                response = 1

                            }
                            else {
                                response = 2
                            }

                        }



                    }).catch((error) => {
                        console.log(error)
                        response = 3
                    });
            }
            else {
                let query = "Insert into CTCL_EQUITY.dbo.GlobalSettings(ClientCode,Stop)values(" + ClientCode + "," + stop + ")"
                console.log(query)
                await fetch('/api/ctcl_equity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: query, type: "insert" }),
                }).then((result2) => result2.json()) // here
                    .then((result2) => {
                        console.log(result2['data'])
                        if (result2 && result2['data'] === 1) {
                            response = 1
                        }
                        else {
                            response = 2
                        }
                    })
            }
        })
    return response;
}
export async function updateNotification(userid, Dbid, token) {
    let response = 0
    let tempQuery = ""
    tempQuery = " update CTCL_EQUITY.dbo.ScriptTrans set Notification=0 where ClientCode=" + userid + " and DBID=" + Dbid + " and Token=" + token + ""

    //console.log(tempQuery)
    await fetch('/api/ctcl_equity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: tempQuery, type: "update" }),
    }).then((result) => result.json()) // here
        .then((result) => {

            if (result['data']) {

                if (result['data'] === 2) {
                    response = 1

                }
                else {
                    response = 2
                }

            }



        }).catch((error) => {
            console.log(error)
            response = 3
        });

    return response;
}
export async function UpdateStrategy(price, qty, stopBuy, Stoptrade, userId, Dbid, Token) {
    let response = 0
    let tempQuery = ""
    tempQuery = " update CTCL_EQUITY.dbo.ScriptTrans set PriceGap=" + price + ", Quantity=" + qty + ",StopBuy=" + stopBuy + ",StopTrd=" + Stoptrade + ",Updated=1 where ClientCode=" + userId + " and  DBID=" + Dbid + " and Token=" + Token + ""
    console.log(tempQuery)
    await fetch('/api/ctcl_equity', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: tempQuery, type: "update" }),
    }).then((result) => result.json()) // here
        .then((result) => {

            if (result['data']) {

                if (result['data'] === 2) {
                    response = 1

                }
                else {
                    response = 2
                }

            }



        }).catch((error) => {
            console.log(error)
            response = 3
        });

    return response;
}
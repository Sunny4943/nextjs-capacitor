var sql = require("mssql");
var dbConfig = {
    user: "sa",
    password: "",
    server: "192.168.0.76",
    port: 1433,
    database: "CTCL_EQUITY",
    options: {
        "encrypt": false
    }
};

export const config = {
    api: {
        responseLimit: false,
    },
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }
    const queryString = req.body['query'];

    // const result = await ExcuteQuery('select * from Tempcontract');
    if (req.body['type'] === "select" && (queryString.toLowerCase().includes("select") || queryString.includes("SELECT"))) {
        var dbConn = await sql.connect(dbConfig);
        if (dbConn) {
            sql.query(req.body['query']).then(function (resp) {

                return res.status(200).json({ data: resp.recordset, })

                //  res.status(200).json({ data: resp, })
                //console.log(resp);
                dbConn.close();
                //dbConn.close();
            }).catch(function (err) {
                dbConn.close();
                return res.status(200).json({ data: err, })

            }).finally(function () {
                dbConn.close();
            });
        }
    }
    else if (req.body['type'] === "insert" && queryString.toLowerCase().includes("insert")) {
        var dbConn = await sql.connect(dbConfig);
        if (dbConn) {
            sql.query(req.body['query']).then(function (resp, err) {
                if (err) {
                    return res.status(200).json({ data: err, })
                }
                else {
                    if (parseInt(resp.rowsAffected[0]) > 0) {
                        return res.status(200).json({ data: 1, msg: "Row Inserted SucessFully..." })
                    }
                    else {
                        return res.status(200).json({ data: "No record found...." })
                    }
                }

                //console.log(resp);
                dbConn.close();
                //dbConn.close();
            }).catch(function (err) {
                dbConn.close();
                return res.status(200).json({ data: err, })

            }).finally(function () {
                dbConn.close();
            });
        }
        // res.status(200).json({ data: req.body['query'] })

    }
    else if (req.body['type'] === "update" && queryString.toLowerCase().includes("update")) {
        var dbConn = await sql.connect(dbConfig);
        if (dbConn) {
            sql.query(req.body['query']).then(function (resp, err) {
                if (err) {
                    return res.status(200).json({ data: err, })
                }
                else {
                    if (parseInt(resp.rowsAffected[0]) > 0) {
                        return res.status(200).json({ data: 2, msg: "Updated SucessFully...." })
                    } else {
                        return res.status(200).json({ data: "No record found...." })
                    }
                }

                //console.log(resp);
                dbConn.close();
                //dbConn.close();
            }).catch(function (err) {
                dbConn.close();
                return res.status(200).json({ data: err, })
            }).finally(function () {
                dbConn.close();
            });
        }
        // res.status(200
        // res.status(200).json({ data: req.body['query'] })

    }
    else if (req.body['type'] === "delete" && queryString.toLowerCase().includes("delete")) {
        var dbConn = await sql.connect(dbConfig);
        if (dbConn) {
            sql.query(req.body['query']).then(function (resp, err) {
                if (err) {
                    return res.status(200).json({ data: err, })
                }
                else {
                    if (parseInt(resp.rowsAffected[0]) > 0) {
                        return res.status(200).json({ data: 3, msg: "Deleted SucessFully...." })
                    } else {
                        return res.status(200).json({ data: "No record found...." })
                    }
                }

                //console.log(resp);
                dbConn.close();
                //dbConn.close();
            }).catch(function (err) {
                dbConn.close();
                return res.status(200).json({ data: err, })

            }).finally(function () {
                dbConn.close();
            });
        }
        // res.status(200
        // res.status(200).json({ data: req.body['query'] })

    }
    else {
        return res.status(200).json({ data: "Check Query And Type....." });
    }

    // res.status(200).json({ data: result })
}
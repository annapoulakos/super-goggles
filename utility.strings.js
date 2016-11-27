module.exports = {
    log: (sender, message) => { console.log(`[LOG ${sender}]: ${message}`); },
    info: (sender, message) => { console.log(`[<span style="color: cyan;">INFO ${sender}</span>] ${message}`); },
    warn: (sender, message) => { console.log(`[<span style="color: orange;">WARN ${sender}</span>] ${message}`); },
    error: (sender, message) => { console.log(`[<span style="color: red;">ERROR ${sender}</span>] ${message}`); }
};

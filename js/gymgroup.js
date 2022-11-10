const core = require("./gymcore")

core.req(core.link.login, core.headers, 'POST', core.creds).then((msg)=>{
    core.headers['cookie'] = msg[1]
    for (l in core.link) core.link[l] = core.link[l].replace('UUID', msg[0].uuid)

    core.req(core.link.profile, core.headers, 'GET').then(m=>{
        var text = 'Profile Information\n\n'
        text += `Name: ${m[0].firstname + ' ' + m[0].lastname}\n`
        text += `Birthday: ${m[0].birthday}\n`
        text += `Phone number: ${m[0].phoneNumber}\n`
        text += `Joined at: ${m[0].createdAt}\n`
        text += `PIN: ${m[0].barcode}\n`
        text += `Address:\n`
        for (var a in m[0].address) {
            if (m[0].address[a] == null) continue
            text += '   ' + m[0].address[a] + '\n'
        }
        console.log(text)
    })

    core.req(core.link.gym, core.headers, 'GET').then(m=>{
        var text = 'Gym Information: ' + m[0].gymLocationName + '\n'
        text += `Current people: ${m[0].currentCapacity}\n`
        text += `Current people (%): ${m[0].currentPercentage}\n`
        console.log(text)
    })

    core.req(core.link.activity, core.headers, 'GET').then(m=>{
        var text = 'Total Sessions: ' + m[0].checkIns.length + ' Activity Information:\n\n'
        for (var i = 0; i < m[0].checkIns.length; i++) {
            text += 'Session at ' + m[0].checkIns[i].gymLocationName + '\n'
            text += m[0].checkIns[i].checkInDate.replace('T',' ') + ' for ' + core.mstodate(m[0].checkIns[i].duration) + '\n\n'
        }
        console.log(text)
    })

})

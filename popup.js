function getMemberNames() {
  const memberTextArea = document.getElementById("member")
  const regaxMailAddress = /<\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*>/g
  const members = memberTextArea.value
                    .split(',')
                    .map(str => str.replace(regaxMailAddress, ''))
                    .map(str => str.trim())
                    .filter(str => str.length > 0)
  memberTextArea.value = members.join(',')
  return members
}

function sendToContents() {
  const members = getMemberNames()

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id, 
      {
        method: 'check',
        members
      },
      () => {}
    )
  })
}

function getAttendedMemberList() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id, { method: 'get' },
      (response) => {
        const memberTextArea = document.getElementById("now-member")
        memberTextArea.value = response.join(', ')
      }
    )
  })
}
  
function trimQueryFromUrl(url) {
  const querySymbolIndex = url.indexOf('?')
  if (querySymbolIndex == -1) return url
  return url.slice(url.indexOf('?'))
}

function saveMemberList() {
  const members = getMemberNames()
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.storage.local.set({
      [ trimQueryFromUrl(tabs[0].url) ]: members
    }, function(){
      alert('保存が完了しました')
    })
  })
}

function loadData(){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = trimQueryFromUrl(tabs[0].url)
    chrome.storage.local.get([ url ], function(obj) {
      const members = obj[url]
      if (members) {
        document.getElementById("member").value = members.join(',')
        return
      }
    })
  })
}

loadData()

document.getElementById('check').addEventListener('click', sendToContents)
document.getElementById('get').addEventListener('click', getAttendedMemberList)
document.getElementById('save').addEventListener('click', saveMemberList)
function getMemberNames() {
  const memberTextArea = document.getElementById("member")
  const members = memberTextArea.value.split(',').map(str => str.trim()).filter(str => str.length > 0)
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

function saveMemberList() {
  const members = getMemberNames()
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.storage.local.set({
      [ tabs[0].url ]: members
    }, function(){
      alert('保存が完了しました')
    })
  })
}

function getAttendedMemberList() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id, 
      {
        method: 'get',
      },
      (response) => {
        const memberTextArea = document.getElementById("now-member")
        memberTextArea.value = response.join(', ')
      }
    )
  })
}

function loadData(){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.storage.local.get([ tabs[0].url ], function(obj) {
      const members = obj[tabs[0].url]
      console.log(members)
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
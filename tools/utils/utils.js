//根据某个字段排序
function sortBy(field) {
  return function (a, b) {
    return a[field] - b[field];
  }
}

//对象数组中的某个属性字符串变数组
function objStrToArr(arr, attrName){
  for(var i=0;i<arr.length;i++){
    arr[i][attrName] = arr[i][attrName].split(',')
  }
  return arr
}

//json字符串转json对象
function toJsonObj(jsonStr){
  jsonStr = jsonStr.replace(/(\d+):/g, "\"$1\":")
  jsonStr = JSON.parse(jsonStr)
  return jsonStr
}

//循环json对象
function jsonArrforearch(jsonObj,attr){
  if(typeof jsonObj === "string"){
   jsonObj = toJsonObj(jsonObj)
  }
  var arr = []
  Object.getOwnPropertyNames(jsonObj).forEach(function (key) {
    var obj = {}
    Object.getOwnPropertyNames(jsonStr[key]).forEach(function (_key) {
      obj[_key] = jsonStr[key][_key]
      if(attr === null){
        return
      }else{
        obj[attr] = key
      }
    })
    arr.push(obj)
  })
  return arr
}

//反斜杠转成正斜杠
function changeBackslash(arr, attr){
  for(var i=0;i<arr.length;i++){
    if(typeof arr[i][attr] === "object"){
      for (var j = 0; j < arr[i][attr].length; j++){
        arr[i][attr][j] = arr[i][attr][j].replace(/\\/g, "/")
      }
    } else if (typeof arr[i][attr] === "string"){
      arr[i][attr] = arr[i][attr].replace(/\\/g, "/")
    }
  }
  return arr
}

export{
	sortBy,
	objStrToArr,
	toJsonObj,
	jsonArrforearch,
	changeBackslash
}
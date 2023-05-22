let SimpleFormCallback=require("./SimpleFormCallback.js");
/*
概述：玩家要发出tpa时，插件会向此处传入一个玩家对象
要求马上发起tpa表单
*/
function TPAEntrance(player){
    //发出一个表单，让玩家选择tpa的种类
    let fm=new SimpleFormCallback();
    fm.addButton("请求传送到别人",()=>{

    })
    fm.addButton("请求别人传送过来",()=>{

    })
    fm.send(player);
}
module.exports=TPAEntrance;
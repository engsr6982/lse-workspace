import { Other } from "../Other.js";
import { HomeForm } from "./Home.js";
import { WarpForm } from "./Warp.js";


export function SelectAction(pl, Array, Warp = false, callback) {
    const fm = Other.SimpleForm();
    if (Warp) {
        fm.setContent('· 选择一个公共传送点');
    } else {
        fm.setContent('· 选择一个家');
    }

    Array.forEach(i => {
        fm.addButton(`${i.name}\n${Other.DimidToDimension(i.dimid)}  X: ${i.x} Y: ${i.y} Z: ${i.z}`);
    });

    fm.addButton('返回上一页', 'textures/ui/icon_import');
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return Other.CloseTell();
        if (id == Array.length) {
            if (Warp) {
                //warp
                return WarpForm(pl);
            } else {
                //home
                return HomeForm.Panel(pl);
            }
        }
        callback(id);
    })
}
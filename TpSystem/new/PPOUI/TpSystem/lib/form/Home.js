import { Gm_Tell, MainUI } from "../cache.js";
import { Other } from "../Other.js";

import { Main } from "../form/Mian.js";

export class Home {
    static Panel(pl) {
        const fm = Other.SimpleForm();
        fm.addButton('新建家', 'textures/ui/color_plus');
        fm.addButton('前往家', 'textures/ui/send_icon');
        fm.addButton('编辑家', 'textures/ui/book_edit_default');
        fm.addButton('删除家', 'textures/ui/trash_default');
        fm.addButton('并入公共传送点', 'textures/ui/share_microsoft');
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
                case 4:
                    break;
                case 5: Main(pl, MainUI); break;
                default: Other.CloseTell(pl); break;
            }
        })
    }
}


function NoHome(pl) {
    return pl.tell(Gm_Tell + '你还没有家园传送点,无法继续执行操作！');
}
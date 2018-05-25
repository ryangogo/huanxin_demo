package com.summerzoo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by Administrator on 2018/5/23.
 */

@Controller
public class TestController {

    /**
     * 测试返回到index.html
     * @return
     */
    @RequestMapping("huanxin")
    public String huanxin(Model model){
        System.out.println("测试方法");
        return "index";
    }

}

---
title: "iOS苹果手机机场配置教程 - Shadowrocket小火箭/Loon/Stash安装"
description: "iPhone苹果手机配置科学上网图文指南。外区Apple ID获取方式、Shadowrocket小火箭安装与节点扫码一键导入。"
keywords: ""
h1: "iOS苹果手机科学上网配置教程：小火箭与Loon使用指南"
tag: "使用教程"
readTime: "约 5 分钟"
date: "2026-03-30"
author: "机场Top编辑部"
---

<h2>一、iOS 环境的特殊前提：外区 Apple ID</h2>
      <p>由于大陆地区 App Store 政策限制，所有科学上网客户端（Shadowrocket、Loon、Stash、Surge、Quantumult X）均已在国区下架。您必须先拥有一个海外地区（如美区、港区）的 Apple ID。</p>
      <blockquote>
        <strong>新手提示：</strong>千万不要在 iPhone 的“设置 -> iCloud”中登录非本人的海外账号，只需单独在 <strong>App Store 应用商城</strong> 中退出当前账号并登录外区账号即可。
      </blockquote>

      <h2>二、Shadowrocket（小火箭）极速上手</h2>
      <ol>
        <li>在外区 App Store 搜索 <code>Shadowrocket</code> 并下载安装。</li>
        <li>打开小火箭，点击右上角 <strong>“+”</strong> 号添加节点。</li>
        <li><strong>导入方式：</strong>
          <ul>
            <li><strong>一键扫码：</strong>若电脑端有二维码，在小火箭左上角点击扫描图标即可瞬间导入。</li>
            <li><strong>订阅导入：</strong>类型选择 <code>Subscribe</code>，在 URL 栏粘贴机场订阅链接，备注输入机场名，点击右上角保存。小火箭将自动拉取所有节点。</li>
          </ul>
        </li>
        <li>将全局路由设置为 <strong>“配置 (Config)”</strong>（实现国内直连、海外代理），拨动顶部的连接开关，系统提示允许添加 VPN 配置，输入锁屏密码即完成连接。</li>
      </ol>

      <h2>三、进阶：分流规则更新</h2>
      <p>在小火箭底部点击“配置”，选择默认的 <code>default.conf</code>，定期点击“从 URL 远程更新”，可以确保最新的国内外域名白名单保持最新，杜绝国内App误走代理浪费流量。</p>
      

            <h2 style="margin-top:32px;">搭配优质机场获得极致体验</h2>
            <p>工欲善其事，必先利其器。有了优秀的客户端，还需要一条晚高峰低延迟、不卡顿的专线节点作为支撑：</p>
            <div style="margin:16px 0;display:flex;gap:12px;flex-wrap:wrap;">
              <a href="/recommend/stable.html" class="btn btn-primary btn-sm">查看稳定专线推荐</a>
              <a href="/ranking/value.html" class="btn btn-secondary btn-sm">查看性价比排行</a>
            </div>
          </div>

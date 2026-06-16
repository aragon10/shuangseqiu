# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

双色球随机抽号器 — 一个桌面应用，支持单注/批量生成、历史记录和号码统计。

## 项目结构

纯 HTML 单文件应用（`双色球抽号器.html`），无需构建步骤，双击即可在浏览器中运行。

Electron 版本（`main.js` + `src/`）因环境限制暂不可用，核心逻辑已迁移到 HTML 文件中。

## 运行方式

直接在浏览器中打开 `双色球抽号器.html`。

## 核心逻辑

- **随机数生成**：使用 `crypto.getRandomValues()` 保证随机性
- **双色球规则**：红球 1-33 选 6 个（不重复），蓝球 1-16 选 1 个
- **数据存储**：使用 `localStorage` 保存历史记录

## 代码约定

- 所有逻辑（HTML/CSS/JS）集中在一个 HTML 文件中
- 使用中文注释
- 使用 CSS 变量管理主题色

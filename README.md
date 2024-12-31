# Vault Guard Web - 您的密碼管理器

[![React CI/CD with Yarn and Docker](https://github.com/keke125/vault-guard-web-react/actions/workflows/docker.yml/badge.svg)](https://github.com/keke125/vault-guard-web-react/actions/workflows/docker.yml)

[![GitHub release](https://img.shields.io/github/release/keke125/vault-guard-web-react.svg)](https://github.com/keke125/vault-guard-web-react/releases/latest)
![GitHub language count](https://img.shields.io/github/languages/count/keke125/vault-guard-web-react)
![GitHub top language](https://img.shields.io/github/languages/top/keke125/vault-guard-web-react)

Vault Guard Web 為免費且開放原始碼的網頁應用程式，提供使用者密碼管理的功能。

此為專案的前端部分，需搭配後端一起部署。

後端: [keke125/vault-guard-web-spring](https://github.com/keke125/vault-guard-web-spring)

## 簡介

本專案為網頁應用程式，程式提供使用者產生、儲存、搜尋、備份密碼的功能，同時也提供產生TOTP驗證碼的功能，使用者可以將其作為密碼器使用，或是單純用於兩步驟驗證的驗證器(例如: Google Authenticator、Microsoft Authenticator、Authy)使用。

## 技術

### 程式語言、框架、函式庫、專案管理

![JavaScript](https://shields.io/badge/JavaScript-F7DF1E?logo=JavaScript&logoColor=white&style=for-the-badge)
![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![MUI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-F37E42?style=for-the-badge&logo=yarn&logoColor=white)

### 版本控制、CI/CD

![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

### 支援部署在 Linux 作業系統、容器化

![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

### 推薦使用的網頁伺服器

![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

## 授權條款

[![Licence](https://img.shields.io/github/license/keke125/pixel-art-filter-web?style=for-the-badge)](LICENSE)

## Q & A

* 什麼是TOTP驗證碼?

    TOTP（Time-Based One-Time Password）驗證碼是一種基於時間的一次性驗證碼，用於雙因素驗證（2FA）或多因素驗證（MFA）系統，它會根據當前時間產生一個短暫有效的驗證碼，通常是6位或8位數字，並每隔30秒或60秒自動更新，因為有效期較短，相比密碼來說被盜用的損失也較小，因為實作成本較低，常作為一種雙重驗證的方式。

## 程式截圖

![我的密碼庫](img/img.png)
我的密碼庫

![檢視密碼](img/img_1.png)
檢視密碼

![檢視密碼 - TOTP驗證碼](img/img_4.png)
檢視密碼 - TOTP驗證碼

![新增密碼](img/img_2.png)
新增密碼

![編輯密碼](img/img_3.png)
編輯密碼

![根據條件搜尋密碼](img/img_5.png)
根據條件搜尋密碼

![根據欄位排序密碼](img/img_6.png)
根據欄位排序密碼

![密碼產生器](img/img_7.png)
密碼產生器

![密碼庫設定](img/img_8.png)
密碼庫設定

![帳號設定](img/img_9.png)
帳號設定

## 主要特色

* 整合TOTP驗證碼
* 支援RWD
* 支援PWA
* 支援從Google密碼管理器匯入密碼
* 支援匯入匯出密碼庫
* 方便自架 - 透過 Docker Compose，可一次部署前端、後端、資料庫。
* 效能 - 在 Google Lighthouse 獲得滿分成績。
![Google Lighthouse結果](img/img_10.png)

## 透過 Docker 部署

請參考 [https://hub.docker.com/r/keke125/vault-guard-web-react](https://hub.docker.com/r/keke125/vault-guard-web-react)
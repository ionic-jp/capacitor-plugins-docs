---
title: 'リーダーのライフサイクル'
code: ['reader-lifecycle/reader-lifecycle.ts.md']
scrollActiveLine:
  [
    { id: '', activeLine: { ['reader-lifecycle.ts']: [1, 1] } },
    { id: 'ソフトウェア更新を監視する', activeLine: { ['reader-lifecycle.ts']: [2, 35] } },
    { id: '状態と入力を監視する', activeLine: { ['reader-lifecycle.ts']: [35, 63] } },
    { id: 'リーダーの画面を設定する', activeLine: { ['reader-lifecycle.ts']: [63, 78] } },
    { id: '探索をキャンセルする', activeLine: { ['reader-lifecycle.ts']: [78, 80] } },
    { id: '切断と再接続', activeLine: { ['reader-lifecycle.ts']: [80, 112] } },
    { id: 'エラー処理', activeLine: { ['reader-lifecycle.ts']: [112, 119] } },
  ]
---

Terminal の操作が会計を妨げないよう、リーダーのソフトウェア更新、状態、画面表示を管理します。

## ソフトウェア更新を監視する

必要に応じてリーダーが更新を開始します。利用可能な更新、インストール、キャンセル、進捗をイベントで監視してください。

- 更新をシミュレーションする場合、`discoverReaders` より前に `setSimulatorConfiguration` を呼びます。Web では no-op です。
- 初回接続時の**必須**更新は `ConnectedReader` より前に自動インストールされます。順序は開始 → 進捗（複数回）→ 完了 → 接続 → `connectReader()` 解決です。長い接続を停止と誤認しないUIを表示してください。
- `ReportAvailableUpdate` は任意更新です。会計中に開始せず、加盟店が待てるときに `installAvailableUpdate` を呼びます。
- `progress` は `0` から `1` の値です。
- `cancelInstallUpdate` はSDKが許可する場合に進行中の更新を止めます。Web の更新メソッドは no-op です。
- iOS Tap to Pay も開始・進捗・完了を通知します。

!::installAvailableUpdate::
!::cancelInstallUpdate::
!::setSimulatorConfiguration::

## 状態と入力を監視する

画面を持たないリーダーでは、バッテリー残量、リーダーイベント、表示メッセージ、入力要求をリスナーで取得し、モバイル端末に表示します。Bluetooth と USB で利用でき、バッテリーは接続時と約10分ごとに通知されます。

## リーダーの画面を設定する

画面を持つ端末では `collectPaymentMethod` より前にカート内容を表示し、完了後に消去します。Web の Internet リーダーも対応します。

!::setReaderDisplay::
!::clearReaderDisplay::
!::Cart::
!::CartLineItem::

## 探索をキャンセルする

利用者がスキャン画面を離れたとき、またはタイムアウト時に `cancelDiscoverReaders` を呼びます。ネイティブは成功時に `CancelDiscoveredReaders` を通知し、処理中でなくても Promise は解決します。Web では no-op です。

!::cancelDiscoverReaders::

## 切断と再接続

`disconnectReader` は現在のリーダーを切断し、未接続ならそのまま解決します。手動切断時の `DisconnectedReader` は、理由なしの受付通知と、Bluetooth／USB の理由付き切断通知の2回届く場合があります。

予期しない切断の検出に `ConnectionStatusChange` を使わず、`UnexpectedReaderDisconnect` を使用します。再探索には必ずタイムアウトまたはキャンセル手段を用意してください。

Tap to Pay と Bluetooth で自動再接続するには、`connectReader` に `autoReconnectOnUnexpectedDisconnect: true` を設定し、`ReaderReconnectStarted`、`ReaderReconnectSucceeded`、`ReaderReconnectFailed` を監視します。`cancelReaderReconnection` で進行中の再接続を止められます。

!::getConnectedReader::
!::rebootReader::
!::cancelReaderReconnection::

## エラー処理

収集または確定が失敗すると `Failed` が発生し、Promise も同じ `message`、`code`、`declineCode` で拒否されます。`UnexpectedReaderDisconnect` は明示的な切断以外でリーダーを失ったことを示します。Bluetooth と USB では `DisconnectedReader` の `DisconnectReason` も確認してください。

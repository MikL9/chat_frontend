<template>
	<v-container class="messenger pa-0">
		<chat-left-panel class="left-panel"/>
<!--		<chat-header class="chat-header"/>-->
		<chat-messages class="messages"/>
		<new-message-form class="new-message"/>
	</v-container>
</template>

<script>
import ChatMessages from "../components/chat/chat-messages";
import NewMessageForm from "../components/chat/chat-new-message";
import ChatLeftPanel from "../components/chat/chat-left-panel";
/*import ChatHeader from "@/components/chat/chat-header";*/

export default {
	name: "messenger",
	components: { ChatLeftPanel, ChatMessages, NewMessageForm},
}
</script>

<style scoped lang="scss">
@import "~vuetify/src/styles/styles";

$primary-color: var(--v-primary-base);

.messenger {
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: calc(100vh - 64px - 84px) 80px;
  height: calc(100vh - 64px);
  border: 1px solid rgba(0, 0, 0, 0.12);
  max-width: 1385px;

  .left-panel {
	grid-row: 1/3
  }

  .messages {
	grid-column: 2/3;
	overflow-y: scroll;
  }

  .new-message {
	grid-column: 2/3;
	//background-color: $red;
	border-top: 1px solid rgba(0, 0, 0, 0.12);
  }
}
</style>

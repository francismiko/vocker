<script setup lang="ts">
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const keyHandlerMap: Record<string, string> = {
  Enter: '\r',
  Backspace: '\x7f',
};

const SSHDialogVisible = ref<boolean>(false);

onMounted(() => {
  const terminal = new Terminal({ convertEol: true });
  const fitAddon = new FitAddon();
  const terminalDoc = document.getElementById('terminal')!;
  terminal.loadAddon(fitAddon);
  terminal.open(terminalDoc);
  terminal.write('Hello from \x1B[1;3;31m范挚铖\x1B[0m $ ')

  terminal.onData((data) => {
    if (data === keyHandlerMap['Enter']) {
      terminal.write('\n');
      terminal.write('Hello from \x1B[1;3;31m范挚铖\x1B[0m $ ');
    } else if (data === keyHandlerMap['Backspace']) {
      const cursorPosition = terminal.buffer.active.cursorX;
      if (cursorPosition > 0) {
        terminal.write('\b \b');
      }
    } else {
      terminal.write(data);
    }
  });

  fitAddon.fit();
});

const handleSSHConnect = async () => {
  await $fetch("/api/terminal/ssh")

  SSHDialogVisible.value = false;
}
</script>

<template>
  <!-- <el-button type="primary" plain @click="SSHDialogVisible = true">Primary</el-button> -->
  <el-dialog v-model="SSHDialogVisible" title="Tips" width="30%">
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="SSHDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSSHConnect">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>

  <div id="terminal" />
</template>
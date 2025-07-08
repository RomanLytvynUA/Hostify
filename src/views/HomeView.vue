<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <div class="container-fluid text-center">
    <div class="mb-3">
      <h1>Hostify</h1>
      <figcaption class="blockquote-footer secondary-txt" style="margin-top: -5px !important;">
        {{ t('home.subtitle') }}
      </figcaption>
    </div>
    <RouterLink to="/setup">
      <button class="btn btn-primary btn-lg">{{ t('home.setupBtn') }}</button>
    </RouterLink>
  </div>
</template>

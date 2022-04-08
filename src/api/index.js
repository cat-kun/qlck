import http from '@/utils/https';

export const getToken = params => http({
  url: '/open/auth/token',
  method: 'get',
  params,
});

export const searchUser = params => http({
  url: '/open/envs',
  method: 'get',
  params,
});

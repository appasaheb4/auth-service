import React from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppleAuthenticationCredential } from 'expo-apple-authentication';
import { AppleAuthenticationFullName } from 'expo-apple-authentication/src/AppleAuthentication.types';
import { SocialAuthResponse } from '../../models';

const getNameFromFullName = (fullName: AppleAuthenticationFullName | null) => {
	const givenName = fullName?.givenName ?? '';
	const familyName = fullName?.familyName ?? '';
	return `${givenName} ${familyName}`;
};

const getObjectFromResponse = (credential: AppleAuthenticationCredential) : SocialAuthResponse => {
	const obj = {
		id: credential.authorizationCode,
		name: getNameFromFullName(credential.fullName),
		email: credential.email,
	};

	return new SocialAuthResponse(obj);
};

export class AppleAuth {
	static async signInWithApple(
		callBack : (resObj ?: SocialAuthResponse, message ?: string)=> void,
	) {
		try {
			const appleAuthResponse = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			});

			/**
			 * Name and email only available for first time after that it will return null
			 * so needs to store on first signing.
			 */

			if (appleAuthResponse.fullName?.familyName != null) {
				await AsyncStorage.setItem('AppleAuthData', JSON.stringify(appleAuthResponse));
				callBack(getObjectFromResponse(appleAuthResponse), undefined);
			} else {
				const storedAppleAuthResponse = await AsyncStorage.getItem('AppleAuthData');
				if (storedAppleAuthResponse != null) {
					const storedAppleAuthResponseInJson = JSON.parse(storedAppleAuthResponse);
					const storedCredential = storedAppleAuthResponseInJson as AppleAuthenticationCredential;
					callBack(getObjectFromResponse(storedCredential), undefined);
				}
			}
		} catch ({ message }) {
			callBack(undefined, 'failed');
		}
	}
}

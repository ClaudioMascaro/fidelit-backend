import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class PaymentsService {
  private apiKey: string;
  private apiUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('payments.apiKey');
    this.apiUrl = this.configService.get<string>('payments.apiUrl');
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    const response = await fetch(`${this.apiUrl}/customers`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        access_token: `${this.apiKey}`,
        'User-Agent': 'fidelit.app',
      },
      body: JSON.stringify(createCustomerDto),
    });

    if (!response.ok) {
      throw new Error(
        'Failed to create customer. Status code: ' + response.status,
      );
    }

    return response.json();
  }

  async getCustomer(customerId: string) {
    const response = await fetch(`${this.apiUrl}/customers/${customerId}`, {
      headers: {
        'Content-Type': 'application/json',
        access_token: `${this.apiKey}`,
        'User-Agent': 'fidelit.app',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get customer');
    }

    return response.json();
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const response = await fetch(`${this.apiUrl}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        access_token: `${this.apiKey}`,
        'User-Agent': 'fidelit.app',
      },
      body: JSON.stringify(createSubscriptionDto),
    });

    if (!response.ok) {
      console.log(await response.json());
      throw new Error('Failed to create credit card subscription');
    }

    return response.json();
  }

  async getSubscription(subscriptionId: string) {
    const response = await fetch(
      `${this.apiUrl}/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `access_token: ${this.apiKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error('Failed to get subscription');
    }

    return response.json();
  }
}

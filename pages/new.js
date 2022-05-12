import React, { useContext, useState } from 'react';
import { Flex, Box, useToast } from '@chakra-ui/react';

import { AppContext } from '../context/AppContext';

import { PaymentDetailsForm } from '../components/PaymentDetailsForm';
import { PaymentsChunkForm } from '../components/PaymentsChunkForm';
import { EscrowConfirmation } from '../components/EscrowConfirmation';
import { EscrowSuccess } from '../components/EscrowSuccess';
import { ProjectInfo } from '../components/ProjectInfo';

// web3 functions
import { register } from '../utils/invoice';
import { Page404 } from '../shared/Page404';

export default function NewEscrow() {
  const context = useContext(AppContext);

  const [client, setClient] = useState('');
  const [serviceProvider, setServiceProvider] = useState('');

  const [paymentDue, setPaymentDue] = useState('');
  const [milestones, setMilestones] = useState(1);
  const [selectedDay, setSelectedDay] = useState('');

  const [tokenType, setTokenType] = useState('');

  const [payments, setPayments] = useState(
    Array.from(Array(Number(milestones)))
  );

  const [tx, setTx] = useState('');

  const [step, updateStep] = useState(1);
  const [isLoading, setLoading] = useState(false);

  const toast = useToast();

  const sendToast = (msg, duration = 3000) => {
    toast({
      duration,
      position: 'top',
      render: () => (
        <Box
          color='white'
          p={3}
          mt='2rem'
          bg='#ff3864'
          fontFamily='jetbrains'
          textTransform='uppercase'
        >
          {msg}
        </Box>
      )
    });
  };

  return (
    <>
      {context.raid_id !== '' ? (
        <Flex
          width='100%'
          direction='row'
          alignItems='center'
          justifyContent='space-evenly'
        >
          <ProjectInfo context={context} />
          {step === 1 && (
            <PaymentDetailsForm
              context={context}
              client={client}
              serviceProvider={serviceProvider}
              tokenType={tokenType}
              paymentDue={paymentDue}
              milestones={milestones}
              selectedDay={selectedDay}
              setClient={setClient}
              setServiceProvider={setServiceProvider}
              setTokenType={setTokenType}
              setPaymentDue={setPaymentDue}
              setMilestones={setMilestones}
              setSelectedDay={setSelectedDay}
              sendToast={sendToast}
              updateStep={updateStep}
            />
          )}
          {step === 2 && (
            <PaymentsChunkForm
              tokenType={tokenType}
              paymentDue={paymentDue}
              milestones={milestones}
              payments={payments}
              setPayments={setPayments}
              sendToast={sendToast}
              updateStep={updateStep}
            />
          )}
          {step === 3 && (
            <EscrowConfirmation
              context={context}
              client={client}
              serviceProvider={serviceProvider}
              tokenType={tokenType}
              paymentDue={paymentDue}
              milestones={milestones}
              payments={payments}
              selectedDay={selectedDay}
              isLoading={isLoading}
              setLoading={setLoading}
              updateStep={updateStep}
              register={register}
              setTx={setTx}
            />
          )}
          {step === 4 && (
            <EscrowSuccess
              ethersProvider={context.provider}
              tx={tx}
              chainID={context.chainID}
              raidID={context.raid_id}
            />
          )}
        </Flex>
      ) : (
        <Page404 />
      )}
    </>
  );
}

import { useCallback, useState } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';
import { useQuery } from '@apollo/client';
import { GET_CONTENT_CARDS } from 'graphql/gqlConstants';
import DebounceSearch from 'components/DebounceSearch';
import Spin from 'components/Spin';
import Empty from 'components/Empty';
import ContentGrid from './ContentGrid';

const Podcast = () => {
  const { data, loading, error } = useQuery(GET_CONTENT_CARDS);
  const [keyword, setKeyword] = useState('');
  const [filtering, setFiltering] = useState(false);

  const onKeywordChange = useCallback(value => {
    console.log(value);
    setKeyword(value);
  }, []);

  const onFiltering = useCallback(status => {
    setFiltering(status);
  }, []);

  const renderContents = () => {
    const {
      contentCards: { edges },
    } = data;
    const filteredContent = keyword
      ? edges.filter(({ name }) => {
          return name?.toLowerCase().includes(keyword.toLowerCase());
        })
      : edges;
    if(!edges.length) {
      return <Empty message='No Podcasts found' />;
    }
    if(keyword.length && !filteredContent.length){
      return <Empty message='No matches found. Please try a different keyword.' />
    }
    return <ContentGrid content={filteredContent} />;
  };

  return (
    <Stack spacing={4} m={[5, 10]} mt={10}>
      <Box>
        <Text color='white' fontWeight='semibold'>
          Search
        </Text>
        <DebounceSearch
          onChange={onKeywordChange}
          toggleFilterStatus={onFiltering}
        />
      </Box>
      <Spin loading={loading || filtering} tip={`${loading ? 'Loading' : 'Filtering'} podcasts ...`}>
        {error && 'Unable to process your request'}
        {!loading && !error && renderContents()}
      </Spin>
    </Stack>
  );
};

export default Podcast;

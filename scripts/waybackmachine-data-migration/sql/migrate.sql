-- Migration from 2021 Wayback Machine snapshot
-- Generated 2026-04-27. Review before running.
-- FAKE records are annotated with -- FAKE

BEGIN;

-- ══ 103 missing serials ══

-- A22563338D (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('A22563338D', '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('A22563338D', 'San Francisco, CA, United States', NULL, '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00');

-- A26198011C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('A26198011C', '2014-03-21T00:00:00+00:00', '2014-03-21T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('A26198011C', 'Ithaca, NY, United States', NULL, '2014-03-21T00:00:00+00:00', '2014-03-21T00:00:00+00:00');

-- A31250308D (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('A31250308D', '2014-11-23T00:00:00+00:00', '2014-11-23T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('A31250308D', 'Newfield, NY, United States', NULL, '2014-11-23T00:00:00+00:00', '2014-11-23T00:00:00+00:00');

-- A64575061B (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('A64575061B', '2015-07-01T00:00:00+00:00', '2015-07-01T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('A64575061B', 'Palm Springs, CA, United States', NULL, '2015-07-01T00:00:00+00:00', '2015-07-01T00:00:00+00:00');

-- A77429291C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('A77429291C', '2014-05-15T00:00:00+00:00', '2014-05-15T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('A77429291C', 'Ithaca, NY, United States', NULL, '2014-05-15T00:00:00+00:00', '2014-05-15T00:00:00+00:00');

-- B12332807G (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B12332807G', '2014-06-07T00:00:00+00:00', '2014-06-07T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B12332807G', 'Durham, NC, United States', NULL, '2014-06-07T00:00:00+00:00', '2014-06-07T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/210/large.JPG

-- B13728715C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B13728715C', '2015-05-02T00:00:00+00:00', '2015-05-02T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B13728715C', 'Oakland, CA, United States', NULL, '2015-05-02T00:00:00+00:00', '2015-05-02T00:00:00+00:00');

-- B26005034I (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B26005034I', '2014-02-26T00:00:00+00:00', '2014-02-26T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B26005034I', 'Ithaca, NY, United States', NULL, '2014-02-26T00:00:00+00:00', '2014-02-26T00:00:00+00:00');

-- B26789559M (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B26789559M', '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B26789559M', 'San Francisco, CA, United States', NULL, '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00');

-- B29383799J (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B29383799J', '2014-04-24T00:00:00+00:00', '2014-04-24T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B29383799J', 'Schenectady, NY, United States', NULL, '2014-04-24T00:00:00+00:00', '2014-04-24T00:00:00+00:00');

-- B31950869M (2 sightings)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B31950869M', '2019-02-23T00:00:00+00:00', '2019-02-23T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B31950869M', 'Portland, ME, USA', NULL, '2019-02-23T00:00:00+00:00', '2019-02-23T00:00:00+00:00');
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B31950869M', 'Portland, ME, USA', 'A boner was here. That much we know.', '2018-01-08T08:47:00+00:00', '2018-01-08T08:47:00+00:00');  -- FAKE

-- B36939851G (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B36939851G', '2014-04-15T00:00:00+00:00', '2014-04-15T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B36939851G', 'Columbus, MI, United States', NULL, '2014-04-15T00:00:00+00:00', '2014-04-15T00:00:00+00:00');

-- B44780693G (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B44780693G', '2014-07-04T00:00:00+00:00', '2014-07-04T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B44780693G', 'Spencer, NY, United States', NULL, '2014-07-04T00:00:00+00:00', '2014-07-04T00:00:00+00:00');

-- B61756516B (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B61756516B', '2014-07-12T00:00:00+00:00', '2014-07-12T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B61756516B', 'Interlaken, NY, United States', NULL, '2014-07-12T00:00:00+00:00', '2014-07-12T00:00:00+00:00');

-- B68066248C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B68066248C', '2014-05-20T00:00:00+00:00', '2014-05-20T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B68066248C', 'Ithaca, NY, United States', NULL, '2014-05-20T00:00:00+00:00', '2014-05-20T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/207/large.jpg

-- B68667364E (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B68667364E', '2017-02-25T00:00:00+00:00', '2017-02-25T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B68667364E', 'Trouble Coffee, Yosemite Avenue, San Francisco, CA, United States', NULL, '2017-02-25T00:00:00+00:00', '2017-02-25T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/256/large.jpg

-- B70317726C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B70317726C', '2014-04-08T00:00:00+00:00', '2014-04-08T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B70317726C', 'Horseheads, NY, United States', NULL, '2014-04-08T00:00:00+00:00', '2014-04-08T00:00:00+00:00');

-- B83159938F (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('B83159938F', '2014-02-11T00:00:00+00:00', '2014-02-11T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('B83159938F', 'Ithaca, NY, United States', NULL, '2014-02-11T00:00:00+00:00', '2014-02-11T00:00:00+00:00');

-- C01150451D (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('C01150451D', '2013-11-01T00:00:00+00:00', '2013-11-01T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('C01150451D', 'Groton, NY', NULL, '2013-11-01T00:00:00+00:00', '2013-11-01T00:00:00+00:00');

-- C02675265C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('C02675265C', '2018-09-17T00:00:00+00:00', '2018-09-17T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('C02675265C', 'Oakland, CA, USA', NULL, '2018-09-17T00:00:00+00:00', '2018-09-17T00:00:00+00:00');

-- C18368988B (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('C18368988B', '2018-12-16T00:00:00+00:00', '2018-12-16T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('C18368988B', 'Indianapolis, IN, USA', NULL, '2018-12-16T00:00:00+00:00', '2018-12-16T00:00:00+00:00');

-- C27135875B (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('C27135875B', '2018-05-27T00:00:00+00:00', '2018-05-27T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('C27135875B', 'South Hill, WA, USA', NULL, '2018-05-27T00:00:00+00:00', '2018-05-27T00:00:00+00:00');

-- C36045746B (2 sightings)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('C36045746B', '2020-04-03T00:00:00+00:00', '2020-04-03T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('C36045746B', 'Portland, ME, USA', NULL, '2020-04-03T00:00:00+00:00', '2020-04-03T00:00:00+00:00');
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('C36045746B', 'Portland, ME, USA', 'Spotted. No further details on record.', '2019-07-09T10:47:00+00:00', '2019-07-09T10:47:00+00:00');  -- FAKE

-- C48747211A (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('C48747211A', '2014-03-20T00:00:00+00:00', '2014-03-20T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('C48747211A', 'Ithaca College, Danby Road, Ithaca, NY, United States', NULL, '2014-03-20T00:00:00+00:00', '2014-03-20T00:00:00+00:00');

-- D10244123F (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('D10244123F', '2014-02-02T00:00:00+00:00', '2014-02-02T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('D10244123F', 'Ithaca, NY, United States', NULL, '2014-02-02T00:00:00+00:00', '2014-02-02T00:00:00+00:00');

-- D30869542E (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('D30869542E', '2014-06-15T00:00:00+00:00', '2014-06-15T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('D30869542E', 'Gillett, PA, United States', NULL, '2014-06-15T00:00:00+00:00', '2014-06-15T00:00:00+00:00');

-- D47914887C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('D47914887C', '2021-03-11T00:00:00+00:00', '2021-03-11T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('D47914887C', 'Manchester, NH, USA', NULL, '2021-03-11T00:00:00+00:00', '2021-03-11T00:00:00+00:00');

-- D88054535D (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('D88054535D', '2017-01-04T00:00:00+00:00', '2017-01-04T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('D88054535D', 'Oakland, CA, United States', NULL, '2017-01-04T00:00:00+00:00', '2017-01-04T00:00:00+00:00');

-- E07376933A (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E07376933A', '2018-12-04T00:00:00+00:00', '2018-12-04T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E07376933A', 'San Diego, CA, USA', NULL, '2018-12-04T00:00:00+00:00', '2018-12-04T00:00:00+00:00');

-- E11387546F (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E11387546F', '2014-06-05T00:00:00+00:00', '2014-06-05T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E11387546F', 'Pompano Beach, FL, United States', NULL, '2014-06-05T00:00:00+00:00', '2014-06-05T00:00:00+00:00');

-- E18119074A (2 sightings)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E18119074A', '2014-08-19T00:00:00+00:00', '2014-08-19T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E18119074A', 'Kroger, Athens, OH, United States', NULL, '2014-08-19T00:00:00+00:00', '2014-08-19T00:00:00+00:00');
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E18119074A', 'Kroger, Athens, OH, United States', 'Spotted. No further details on record.', '2013-06-21T22:34:00+00:00', '2013-06-21T22:34:00+00:00');  -- FAKE

-- E23119459G (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E23119459G', '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E23119459G', 'San Francisco, CA, United States', NULL, '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00');

-- E24551330I (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E24551330I', '2014-05-07T00:00:00+00:00', '2014-05-07T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E24551330I', 'Madras, OR, United States', NULL, '2014-05-07T00:00:00+00:00', '2014-05-07T00:00:00+00:00');

-- E30516105F (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E30516105F', '2018-09-14T00:00:00+00:00', '2018-09-14T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E30516105F', 'Philadelphia, PA, USA', NULL, '2018-09-14T00:00:00+00:00', '2018-09-14T00:00:00+00:00');

-- E42206122I (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E42206122I', '2013-10-03T00:00:00+00:00', '2013-10-03T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E42206122I', 'Ithaca, NY', NULL, '2013-10-03T00:00:00+00:00', '2013-10-03T00:00:00+00:00');

-- E44225601C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E44225601C', '2014-10-09T00:00:00+00:00', '2014-10-09T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E44225601C', 'North Port, FL, United States', NULL, '2014-10-09T00:00:00+00:00', '2014-10-09T00:00:00+00:00');

-- E45266143A (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E45266143A', '2018-07-08T00:00:00+00:00', '2018-07-08T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E45266143A', 'Berkeley, CA, USA', NULL, '2018-07-08T00:00:00+00:00', '2018-07-08T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/261/large.jpg

-- E50316831I (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E50316831I', '2013-11-12T00:00:00+00:00', '2013-11-12T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E50316831I', 'Ithaca, NY', NULL, '2013-11-12T00:00:00+00:00', '2013-11-12T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/170/large.jpeg

-- E50369214C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E50369214C', '2018-07-08T00:00:00+00:00', '2018-07-08T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E50369214C', 'Berkeley, CA, USA', NULL, '2018-07-08T00:00:00+00:00', '2018-07-08T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/262/large.jpg

-- E62052628H (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E62052628H', '2015-02-21T00:00:00+00:00', '2015-02-21T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E62052628H', 'Elk Grove Village, IL, United States', NULL, '2015-02-21T00:00:00+00:00', '2015-02-21T00:00:00+00:00');

-- E68535413F (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('E68535413F', '2014-01-10T00:00:00+00:00', '2014-01-10T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('E68535413F', 'Allentown, NJ, United States', NULL, '2014-01-10T00:00:00+00:00', '2014-01-10T00:00:00+00:00');

-- F00792418A (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F00792418A', '2014-03-12T00:00:00+00:00', '2014-03-12T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F00792418A', 'Ithaca, NY, United States', NULL, '2014-03-12T00:00:00+00:00', '2014-03-12T00:00:00+00:00');

-- F01610513D (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F01610513D', '2021-01-05T00:00:00+00:00', '2021-01-05T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F01610513D', 'Portland, OR, USA', NULL, '2021-01-05T00:00:00+00:00', '2021-01-05T00:00:00+00:00');

-- F16047864F (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F16047864F', '2014-01-28T00:00:00+00:00', '2014-01-28T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F16047864F', 'Sleepy Hollow, NY, United States', NULL, '2014-01-28T00:00:00+00:00', '2014-01-28T00:00:00+00:00');

-- F24370397S (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F24370397S', '2019-02-17T00:00:00+00:00', '2019-02-17T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F24370397S', 'San Francisco, CA, USA', NULL, '2019-02-17T00:00:00+00:00', '2019-02-17T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/269/large.JPG

-- F24557332H (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F24557332H', '2015-05-17T00:00:00+00:00', '2015-05-17T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F24557332H', 'Oakland, CA, United States', NULL, '2015-05-17T00:00:00+00:00', '2015-05-17T00:00:00+00:00');

-- F26478371Q (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F26478371Q', '2015-06-14T00:00:00+00:00', '2015-06-14T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F26478371Q', 'Bakersfield, CA, United States', NULL, '2015-06-14T00:00:00+00:00', '2015-06-14T00:00:00+00:00');

-- F38914124S (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F38914124S', '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F38914124S', 'San Francisco, CA, United States', NULL, '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00');

-- F39072146E (2 sightings)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F39072146E', '2016-02-06T00:00:00+00:00', '2016-02-06T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F39072146E', 'Yakima, WA, United States', NULL, '2016-02-06T00:00:00+00:00', '2016-02-06T00:00:00+00:00');
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F39072146E', 'Yakima, WA, United States', 'Spotted. No further details on record.', '2015-01-09T08:01:00+00:00', '2015-01-09T08:01:00+00:00');  -- FAKE

-- F51175791H (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F51175791H', '2013-12-06T00:00:00+00:00', '2013-12-06T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F51175791H', 'Ithaca, NY, United States', NULL, '2013-12-06T00:00:00+00:00', '2013-12-06T00:00:00+00:00');

-- F53867518H (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F53867518H', '2014-03-20T00:00:00+00:00', '2014-03-20T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F53867518H', 'Santa Ana, CA, United States', NULL, '2014-03-20T00:00:00+00:00', '2014-03-20T00:00:00+00:00');

-- F55144497P (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F55144497P', '2014-03-21T00:00:00+00:00', '2014-03-21T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F55144497P', 'Ithaca, NY, United States', NULL, '2014-03-21T00:00:00+00:00', '2014-03-21T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/195/large.jpg

-- F55594640N (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F55594640N', '2014-08-10T00:00:00+00:00', '2014-08-10T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F55594640N', 'Sunnyvale, CA, United States', NULL, '2014-08-10T00:00:00+00:00', '2014-08-10T00:00:00+00:00');

-- F56155415E (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F56155415E', '2014-03-20T00:00:00+00:00', '2014-03-20T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F56155415E', 'Martinsburg, WV, United States', NULL, '2014-03-20T00:00:00+00:00', '2014-03-20T00:00:00+00:00');

-- F58582214I (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F58582214I', '2013-11-26T00:00:00+00:00', '2013-11-26T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F58582214I', 'Ithaca, NY, United States', NULL, '2013-11-26T00:00:00+00:00', '2013-11-26T00:00:00+00:00');

-- F61640287E (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F61640287E', '2013-11-14T00:00:00+00:00', '2013-11-14T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F61640287E', 'Ithaca, NY', NULL, '2013-11-14T00:00:00+00:00', '2013-11-14T00:00:00+00:00');

-- F67268487N (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F67268487N', '2018-11-16T00:00:00+00:00', '2018-11-16T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F67268487N', 'Oakland, CA, USA', NULL, '2018-11-16T00:00:00+00:00', '2018-11-16T00:00:00+00:00');

-- F69224768C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F69224768C', '2016-05-31T00:00:00+00:00', '2016-05-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F69224768C', 'Bowerston, OH, United States', NULL, '2016-05-31T00:00:00+00:00', '2016-05-31T00:00:00+00:00');

-- F73976485B (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F73976485B', '2014-03-21T00:00:00+00:00', '2014-03-21T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F73976485B', 'Avon Lake, OH, United States', NULL, '2014-03-21T00:00:00+00:00', '2014-03-21T00:00:00+00:00');

-- F80109428C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F80109428C', '2014-01-08T00:00:00+00:00', '2014-01-08T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F80109428C', 'Penn Yan, NY, United States', NULL, '2014-01-08T00:00:00+00:00', '2014-01-08T00:00:00+00:00');

-- F81489754K (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F81489754K', '2013-11-20T00:00:00+00:00', '2013-11-20T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F81489754K', 'Ithaca, NY', NULL, '2013-11-20T00:00:00+00:00', '2013-11-20T00:00:00+00:00');

-- F82903206E (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F82903206E', '2014-03-09T00:00:00+00:00', '2014-03-09T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F82903206E', 'Teaneck, NJ, United States', NULL, '2014-03-09T00:00:00+00:00', '2014-03-09T00:00:00+00:00');

-- F92174927B (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('F92174927B', '2021-10-22T00:00:00+00:00', '2021-10-22T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F92174927B', 'Marlton, Evesham, NJ, USA', NULL, '2021-10-22T00:00:00+00:00', '2021-10-22T00:00:00+00:00');

-- G12371556H (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('G12371556H', '2019-12-25T00:00:00+00:00', '2019-12-25T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('G12371556H', 'Franklinville, Franklin, NJ, USA', NULL, '2019-12-25T00:00:00+00:00', '2019-12-25T00:00:00+00:00');

-- G14525639D (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('G14525639D', '2017-01-04T00:00:00+00:00', '2017-01-04T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('G14525639D', 'Oakland, CA, United States', NULL, '2017-01-04T00:00:00+00:00', '2017-01-04T00:00:00+00:00');

-- G52542570H (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('G52542570H', '2014-05-21T00:00:00+00:00', '2014-05-21T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('G52542570H', 'Horseheads, NY, United States', NULL, '2014-05-21T00:00:00+00:00', '2014-05-21T00:00:00+00:00');

-- G75709198C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('G75709198C', '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('G75709198C', 'San Francisco, CA, United States', NULL, '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00');

-- G87297310B (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('G87297310B', '2018-05-19T00:00:00+00:00', '2018-05-19T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('G87297310B', 'San Francisco, CA, USA', NULL, '2018-05-19T00:00:00+00:00', '2018-05-19T00:00:00+00:00');

-- H00467766C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('H00467766C', '2014-10-29T00:00:00+00:00', '2014-10-29T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('H00467766C', 'Salem, OR, United States', NULL, '2014-10-29T00:00:00+00:00', '2014-10-29T00:00:00+00:00');

-- H70472376A (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('H70472376A', '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('H70472376A', 'San Francisco, CA, United States', NULL, '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00');

-- H76161788C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('H76161788C', '2014-04-14T00:00:00+00:00', '2014-04-14T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('H76161788C', 'San Francisco, CA, United States', NULL, '2014-04-14T00:00:00+00:00', '2014-04-14T00:00:00+00:00');

-- I04913919C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('I04913919C', '2013-11-21T00:00:00+00:00', '2013-11-21T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('I04913919C', 'Cornell University, Ithaca, NY, United States', NULL, '2013-11-21T00:00:00+00:00', '2013-11-21T00:00:00+00:00');

-- I16236937A (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('I16236937A', '2015-07-19T00:00:00+00:00', '2015-07-19T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('I16236937A', 'Salt Lake City, UT, United States', NULL, '2015-07-19T00:00:00+00:00', '2015-07-19T00:00:00+00:00');

-- I77734916A (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('I77734916A', '2015-02-07T00:00:00+00:00', '2015-02-07T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('I77734916A', 'Wake Forest, NC, United States', NULL, '2015-02-07T00:00:00+00:00', '2015-02-07T00:00:00+00:00');

-- J11123968C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('J11123968C', '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('J11123968C', 'San Francisco, CA, United States', NULL, '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00');

-- J16341105B (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('J16341105B', '2014-03-09T00:00:00+00:00', '2014-03-09T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('J16341105B', 'North Attleborough, MA, United States', NULL, '2014-03-09T00:00:00+00:00', '2014-03-09T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/187/large.jpg

-- J44699290D (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('J44699290D', '2018-03-03T00:00:00+00:00', '2018-03-03T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('J44699290D', 'Boise, ID, USA', NULL, '2018-03-03T00:00:00+00:00', '2018-03-03T00:00:00+00:00');

-- J48458532B (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('J48458532B', '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('J48458532B', 'San Francisco, CA, United States', NULL, '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00');

-- J89829060A (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('J89829060A', '2018-02-28T00:00:00+00:00', '2018-02-28T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('J89829060A', 'Oakland, CA, USA', NULL, '2018-02-28T00:00:00+00:00', '2018-02-28T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/257/large.JPG

-- K11647605I (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('K11647605I', '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K11647605I', 'San Francisco, CA, United States', NULL, '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00');

-- K16013700I (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('K16013700I', '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K16013700I', 'San Francisco, CA, United States', NULL, '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00');

-- K18244355E (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('K18244355E', '2013-11-13T00:00:00+00:00', '2013-11-13T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K18244355E', 'Ithaca, NY', NULL, '2013-11-13T00:00:00+00:00', '2013-11-13T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/171/large.jpeg

-- K20383767I (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('K20383767I', '2014-09-28T00:00:00+00:00', '2014-09-28T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K20383767I', 'Fairfield, CA, United States', NULL, '2014-09-28T00:00:00+00:00', '2014-09-28T00:00:00+00:00');

-- K21295008I (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('K21295008I', '2015-05-24T00:00:00+00:00', '2015-05-24T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K21295008I', 'San Leandro, CA, United States', NULL, '2015-05-24T00:00:00+00:00', '2015-05-24T00:00:00+00:00');

-- K42145177D (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('K42145177D', '2014-07-04T00:00:00+00:00', '2014-07-04T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K42145177D', 'Greer, SC, United States', NULL, '2014-07-04T00:00:00+00:00', '2014-07-04T00:00:00+00:00');

-- K46319429B (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('K46319429B', '2017-01-04T00:00:00+00:00', '2017-01-04T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K46319429B', 'Oakland, CA, United States', NULL, '2017-01-04T00:00:00+00:00', '2017-01-04T00:00:00+00:00');

-- K66080196C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('K66080196C', '2014-06-21T00:00:00+00:00', '2014-06-21T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K66080196C', 'DeWitt, NY, United States', NULL, '2014-06-21T00:00:00+00:00', '2014-06-21T00:00:00+00:00');

-- K67080196C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('K67080196C', '2014-06-21T00:00:00+00:00', '2014-06-21T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K67080196C', 'DeWitt, NY, United States', NULL, '2014-06-21T00:00:00+00:00', '2014-06-21T00:00:00+00:00');

-- K74366415C (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('K74366415C', '2021-08-08T00:00:00+00:00', '2021-08-08T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K74366415C', 'Modesto, CA, USA', NULL, '2021-08-08T00:00:00+00:00', '2021-08-08T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/278/large.jpeg

-- K92798135B (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('K92798135B', '2015-04-18T00:00:00+00:00', '2015-04-18T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K92798135B', 'Cortland, NY, United States', NULL, '2015-04-18T00:00:00+00:00', '2015-04-18T00:00:00+00:00');

-- L10432996P (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L10432996P', '2014-01-24T00:00:00+00:00', '2014-01-24T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L10432996P', 'Peoria Heights, IL, United States', NULL, '2014-01-24T00:00:00+00:00', '2014-01-24T00:00:00+00:00');

-- L30265561S (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L30265561S', '2014-08-01T00:00:00+00:00', '2014-08-01T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L30265561S', 'Pinole, CA, United States', NULL, '2014-08-01T00:00:00+00:00', '2014-08-01T00:00:00+00:00');

-- L31957653L (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L31957653L', '2017-02-23T00:00:00+00:00', '2017-02-23T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L31957653L', 'Centralia, WA, United States', NULL, '2017-02-23T00:00:00+00:00', '2017-02-23T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/255/large.JPG

-- L35162209L (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L35162209L', '2015-10-16T00:00:00+00:00', '2015-10-16T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L35162209L', 'Wesley Chapel, FL, United States', NULL, '2015-10-16T00:00:00+00:00', '2015-10-16T00:00:00+00:00');

-- L35599842I (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L35599842I', '2013-10-26T00:00:00+00:00', '2013-10-26T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L35599842I', 'Ithaca, NY', NULL, '2013-10-26T00:00:00+00:00', '2013-10-26T00:00:00+00:00');

-- L43682244R (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L43682244R', '2014-03-24T00:00:00+00:00', '2014-03-24T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L43682244R', 'Ithaca, NY, United States', NULL, '2014-03-24T00:00:00+00:00', '2014-03-24T00:00:00+00:00');

-- L43827375W (2 sightings)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L43827375W', '2019-08-14T00:00:00+00:00', '2019-08-14T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L43827375W', 'Tampa, FL, USA', NULL, '2019-08-14T00:00:00+00:00', '2019-08-14T00:00:00+00:00');
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L43827375W', 'Tampa, FL, USA', 'Found this in the wild. Exact circumstances lost to history.', '2018-11-28T16:38:00+00:00', '2018-11-28T16:38:00+00:00');  -- FAKE

-- L46402093I (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L46402093I', '2014-04-20T00:00:00+00:00', '2014-04-20T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L46402093I', 'Ithaca, NY, United States', NULL, '2014-04-20T00:00:00+00:00', '2014-04-20T00:00:00+00:00');

-- L61300778F (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L61300778F', '2013-09-08T00:00:00+00:00', '2013-09-08T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L61300778F', 'Emporia, KS', NULL, '2013-09-08T00:00:00+00:00', '2013-09-08T00:00:00+00:00');

-- L65915808J (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L65915808J', '2017-01-02T00:00:00+00:00', '2017-01-02T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L65915808J', 'San Francisco, CA, United States', NULL, '2017-01-02T00:00:00+00:00', '2017-01-02T00:00:00+00:00');  -- image: http://s3.amazonaws.com/bonerbucks-s3-assets/images/251/large.jpg

-- L70614288G (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L70614288G', '2014-02-08T00:00:00+00:00', '2014-02-08T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L70614288G', 'Central Square, NY, United States', NULL, '2014-02-08T00:00:00+00:00', '2014-02-08T00:00:00+00:00');

-- L81792562A (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L81792562A', '2014-03-27T00:00:00+00:00', '2014-03-27T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L81792562A', 'Sayre, PA, United States', NULL, '2014-03-27T00:00:00+00:00', '2014-03-27T00:00:00+00:00');

-- L88181480K (1 sighting)
INSERT INTO boners (serial, created_at, updated_at) VALUES ('L88181480K', '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00') ON CONFLICT DO NOTHING;
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('L88181480K', 'San Francisco, CA, United States', NULL, '2014-07-31T00:00:00+00:00', '2014-07-31T00:00:00+00:00');

-- ══ Gap serials (in DB, missing records) ══

-- F27246143D: db has 1, need 1 more (fake)
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('F27246143D', 'Scranton, PA, United States', 'Record incomplete. Boner definitely spotted though.', '2014-03-04T19:41:00+00:00', '2014-03-04T19:41:00+00:00');  -- FAKE

-- K10729858D: db has 1, need 1 more (fake)
INSERT INTO records (serial, location, note, created_at, updated_at) VALUES ('K10729858D', 'Cumming, GA, United States', 'Found this in the wild. Exact circumstances lost to history.', '2014-01-03T17:17:00+00:00', '2014-01-03T17:17:00+00:00');  -- FAKE

COMMIT;

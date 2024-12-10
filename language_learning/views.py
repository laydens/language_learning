class FlashcardView(APIView):
    def get(self, request):
        num_cards = int(request.GET.get('num_cards', 50))
        level = request.GET.get('level', 'beginner')
        
        level_mapping = {
            'beginner': ['N5', 'N4'],
            'intermediate': ['N3', 'N2'],
            'advanced': ['N1']
        }
        
        db_levels = level_mapping.get(level, ['N5'])

        vocab_with_meanings = (
            Vocab.objects
            .using('language_learning')
            .filter(
                lang_id=1,
                level__in=db_levels
            )
            .prefetch_related('meanings_set')
            .order_by('?')[:num_cards]
        )

        flashcards = []
        for vocab in vocab_with_meanings:
            meanings = Meanings.objects.using('language_learning').filter(
                entity_id=vocab.id,
                entity_type='vocab',
                lang_id=2
            ).order_by('ord')

            flashcard = {
                'expr': vocab.expr,
                'reading': vocab.reading,
                'meanings': [{'meaning': m.meaning} for m in meanings],
                'level': vocab.level,
                'pos': vocab.pos
            }
            flashcards.append(flashcard)

        return Response(flashcards) 